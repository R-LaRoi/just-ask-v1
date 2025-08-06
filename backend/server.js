// server.js

require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow requests from your app
app.use(express.json()); // Allow the server to read JSON from request bodies

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Just Ask API is running!" });
});

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
      return res
        .status(400)
        .json({ message: "Authorization code is required." });
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

// --- JWT Middleware for Protected Routes ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// --- Onboarding Endpoint ---
app.patch("/api/users/onboarding", authenticateToken, async (req, res) => {
  console.log("Onboarding endpoint hit");
  console.log("Request body:", req.body);
  console.log("User ID:", req.user.userId);

  try {
    const { name, socialHandle, gender, age, location } = req.body;
    const userId = req.user.userId;

    if (!name || !socialHandle) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ message: "Name and social handle are required" });
    }

    console.log("Connecting to database...");
    // Connect to the database
    await mongoClient.connect();
    const db = mongoClient.db("just_ask_v1");
    const usersCollection = db.collection("users");

    console.log("Updating user...");
    // Update user with onboarding data
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: {
          name,
          socialHandle,
          gender: gender || null,
          age: age ? parseInt(age) : null,
          location: location || null,
          profileCreated: true,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
      }
    );

    console.log("Update result:", result);

    if (!result.value) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Sending success response");
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: result.value._id,
        email: result.value.email,
        name: result.value.name,
        socialHandle: result.value.socialHandle,
        onboardingComplete: result.value.onboardingComplete,
        profileCreated: result.value.profileCreated,
      },
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during onboarding" });
  }
});

// --- Profile Creation Endpoint ---
app.patch("/api/users/profile", authenticateToken, async (req, res) => {
  try {
    const { interests } = req.body;
    const userId = req.user.userId;

    if (!interests || interests.trim() === "") {
      return res.status(400).json({ message: "Interests are required" });
    }

    // Connect to the database
    await mongoClient.connect();
    const db = mongoClient.db("just_ask_v1");
    const usersCollection = db.collection("users");

    // Update user with profile data
    const result = await usersCollection.findOneAndUpdate(
      { _id: new require("mongodb").ObjectId(userId) },
      {
        $set: {
          interests: interests.trim(),
          profileComplete: true,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!result.value) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile created successfully",
      user: {
        id: result.value._id,
        email: result.value.email,
        name: result.value.name,
        interests: result.value.interests,
        profileComplete: result.value.profileComplete,
      },
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during profile creation" });
  }
});

// --- Survey Management Endpoints ---

// Create/Save a new survey
app.post("/api/surveys", authenticateToken, async (req, res) => {
  try {
    const { title, description, questions, estimatedTime, settings } = req.body;
    const userId = req.user.userId;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        message: "Title and at least one question are required",
      });
    }

    await mongoClient.connect();
    const db = mongoClient.db("just_ask_v1");
    const surveysCollection = db.collection("surveys");

    const survey = {
      title,
      description: description || "",
      questions,
      estimatedTime: estimatedTime || "2 min",
      questionCount: questions.length,
      settings: settings || {
        allowBack: true,
        showProgress: true,
        autoSave: false,
      },
      createdBy: new ObjectId(userId),
      isPublished: true,
      shareUrl: null, // Will be set after creation
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalResponses: 0,
        completionRate: 0,
        averageTime: 0,
      },
    };

    const result = await surveysCollection.insertOne(survey);
    const surveyId = result.insertedId.toString();

    // Update with share URL
    const shareUrl = `https://justask.app/survey/${surveyId}`;
    await surveysCollection.updateOne(
      { _id: result.insertedId },
      { $set: { shareUrl } }
    );

    console.log("✅ Survey created successfully:", { surveyId, title });

    res.status(201).json({
      message: "Survey created successfully",
      surveyId,
      shareUrl,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        shareUrl
      )}`,
    });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's surveys
app.get("/api/surveys", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await mongoClient.connect();
    const db = mongoClient.db("just_ask_v1");
    const surveysCollection = db.collection("surveys");

    const surveys = await surveysCollection
      .find({ createdBy: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ surveys });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get public survey for respondents (no auth required)
app.get("/api/surveys/:surveyId/public", async (req, res) => {
  try {
    const { surveyId } = req.params;

    if (!ObjectId.isValid(surveyId)) {
      return res.status(400).json({ message: "Invalid survey ID" });
    }

    await mongoClient.connect();
    const db = mongoClient.db("just_ask_v1");
    const surveysCollection = db.collection("surveys");

    const survey = await surveysCollection.findOne({
      _id: new ObjectId(surveyId),
      isPublished: true,
    });

    if (!survey) {
      return res
        .status(404)
        .json({ message: "Survey not found or not published" });
    }

    // Return only public data (no creator info)
    const publicSurvey = {
      id: survey._id,
      title: survey.title,
      description: survey.description,
      questions: survey.questions,
      estimatedTime: survey.estimatedTime,
      questionCount: survey.questionCount,
      settings: survey.settings,
    };

    res.json({ survey: publicSurvey });
  } catch (error) {
    console.error("Error fetching public survey:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Submit survey response (no auth required)
app.post("/api/surveys/:surveyId/responses", async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { responses, completedAt, timeSpent } = req.body;

    if (!ObjectId.isValid(surveyId)) {
      return res.status(400).json({ message: "Invalid survey ID" });
    }

    if (!responses || responses.length === 0) {
      return res.status(400).json({ message: "Responses are required" });
    }

    await mongoClient.connect();
    const db = mongoClient.db("just_ask_v1");
    const responsesCollection = db.collection("survey_responses");
    const surveysCollection = db.collection("surveys");

    // Verify survey exists and is published
    const survey = await surveysCollection.findOne({
      _id: new ObjectId(surveyId),
      isPublished: true,
    });

    if (!survey) {
      return res
        .status(404)
        .json({ message: "Survey not found or not published" });
    }

    // Save response
    const response = {
      surveyId: new ObjectId(surveyId),
      responses,
      completedAt: completedAt ? new Date(completedAt) : new Date(),
      timeSpent: timeSpent || 0,
      submittedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
    };

    await responsesCollection.insertOne(response);

    // Update survey stats
    const totalResponses = await responsesCollection.countDocuments({
      surveyId: new ObjectId(surveyId),
    });

    await surveysCollection.updateOne(
      { _id: new ObjectId(surveyId) },
      {
        $set: {
          "stats.totalResponses": totalResponses,
          updatedAt: new Date(),
        },
      }
    );

    console.log("✅ Survey response submitted:", {
      surveyId,
      responseCount: totalResponses,
    });

    res.status(201).json({
      message: "Response submitted successfully",
      responseId: response._id,
    });
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({ message: "Internal server error" });
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

// Updated Backend Profile Endpoint (without bio)
// --- Get Current User Endpoint ---
app.get("/api/users/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Connect to the database
    await mongoClient.connect();
    const db = mongoClient.db("just_ask_v1");
    const usersCollection = db.collection("users");

    // Find the user by ID
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        socialHandle: user.socialHandle,
        gender: user.gender,
        age: user.age,
        location: user.location,
        interests: user.interests,
        onboardingComplete: user.onboardingComplete || false,
        profileCreated: user.profileCreated || false,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching user data" });
  }
});
