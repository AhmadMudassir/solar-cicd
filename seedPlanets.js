require('dotenv').config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Define schema and model inline or import from model file
const dataSchema = new mongoose.Schema({
  name: String,
  id: Number,
  description: String,
  image: String,
  velocity: String,
  distance: String
});

const Planet = mongoose.model("planets", dataSchema);

// Load planet data from JSON file
const dataPath = path.join(__dirname, "planets.json");
const planetData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  user: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("Connected to MongoDB ✅");

  for (const planet of planetData) {
    const exists = await Planet.findOne({ id: planet.id });

    if (!exists) {
      await Planet.create(planet);
      console.log(`Inserted: ${planet.name}`);
    } else {
      console.log(`Skipped (already exists): ${planet.name}`);
    }
  }

  mongoose.connection.close();
  console.log("Seeding completed 🔚");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

