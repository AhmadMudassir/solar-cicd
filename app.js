const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connection Successful");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);

// POST endpoint to fetch planet data
app.post('/planet', async function (req, res) {
    try {
        const planetData = await planetModel.findOne({ id: req.body.id });
        if (!planetData) {
            return res.status(404).json({ message: 'Planet not found' });
        }
        res.status(200).json(planetData);
    } catch (err) {
        console.error("Error fetching planet:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Serve the index.html file for root route
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// GET endpoint to fetch OS details
app.get('/os', (req, res) => {
    res.json({
           "os": OS.hostname()
    });
});

// GET endpoint to check liveness
app.get('/live', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "live"
    });
});

// GET endpoint to check readiness
app.get('/ready', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "status": "ready"
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Server successfully running on port - " + 3000);
});

module.exports = app;

