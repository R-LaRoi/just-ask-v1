// server.js

require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow requests from your app
app.use(express.json()); // Allow the server to read JSON from request bodies

// --- Environment Variables ---
const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID_WEB;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET_WEB;

if (!uri || !JWT_SECRET || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("FATAL ERROR: Missing required environment variables.");
  process.exit(1);
}

// --- Initialize Clients ---
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

// --- The Google Authentication Endpoint ---
app.post("/api/auth/google", async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Authorization code is required." });
    }

    // Exchange authorization code for tokens
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: redirectUri,
    });

    // Verify the ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token." });
    }

    const { sub: googleId, email, name, picture } = payload;

    // 2. Connect to the database
    await mongoClient.connect();
    const db = mongoClient.db("just_ask_v1");
    const usersCollection = db.collection("users");

    // 3. Find or create a user (Upsert)
    const result = await usersCollection.findOneAndUpdate(
      { googleId: googleId }, // Find user by their unique Google ID
      {
        $set: {
          // Set/update these fields
          email,
          name,
          picture,
          lastLogin: new Date(),
        },
        $setOnInsert: {
          // Only set this if it's a new user
          googleId: googleId,
          createdAt: new Date(),
          onboardingComplete: false,
        },
      },
      {
        returnDocument: "after", // Return the new/updated document
        upsert: true, // If user doesn't exist, create them
      }
    );

    const user = result.value;

    if (!user) {
      return res
        .status(500)
        .json({ message: "Could not retrieve user after upsert." });
    }

    // 4. Create your application's own JWT
    const appToken = jwt.sign(
      {
        userId: user._id, // The unique ID from *your* database
        email: user.email,
        onboardingComplete: user.onboardingComplete,
      },
      JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // 5. Send the JWT and user data back to the app
    res.status(200).json({
      token: appToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        onboardingComplete: user.onboardingComplete,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during authentication." });
  } finally {
    // We don't close the connection here in a server environment
  }
});

// --- Start the server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  // Connect to MongoDB once when the server starts
  mongoClient
    .connect()
    .then(() => {
      console.log("🔌 Successfully connected to MongoDB!");
    })
    .catch(console.error);
});
