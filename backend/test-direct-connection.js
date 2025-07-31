require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

// Get connection string from environment variable
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");

    // List available databases
    const dbs = await client.db().admin().listDatabases();
    console.log("\n📋 Available databases:");
    dbs.databases.forEach((db) => console.log(`   - ${db.name}`));

    // Try to access the specific database
    const db = client.db("just_ask_v1");
    const collections = await db.listCollections().toArray();
    console.log("\n📁 Collections in just_ask_v1:");
    collections.forEach((collection) => console.log(`   - ${collection.name}`));

  } catch (error) {
    console.error("❌ Connection error:", error.message);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("\n🔌 Connection closed");
  }
}

// Run the connection test
run().catch(console.dir);