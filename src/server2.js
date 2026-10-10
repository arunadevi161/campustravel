
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });

// Traveller Schema
const travellerSchema = new mongoose.Schema({
    travellerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    travelDate: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

// Model
const Traveller = mongoose.model("Traveller", travellerSchema);

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index2.html"));
});

// Add a traveller
app.post("/travellers", async (req, res) => {
    try {
        console.log("\n========== NEW TRAVELLER ==========");
        console.log("Received form details:", req.body);

        const {
            travellerId,
            name,
            destination,
            travelDate,
            budget,
            email
        } = req.body;

        if (
            !travellerId ||
            !name ||
            !destination ||
            !travelDate ||
            budget === undefined ||
            budget === "" ||
            !email
        ) {
            console.log("Error: Some fields are missing.");
            return res.status(400).send("Please fill in all fields.");
        }

        const traveller = new Traveller({
            travellerId,
            name,
            destination,
            travelDate,
            budget: Number(budget),
            email
        });

        const savedTraveller = await traveller.save();

        console.log("Traveller saved successfully!");
        console.log(savedTraveller);
        console.log("==================================\n");

        res.send(`
            <h2>Travel buddy added successfully!</h2>
            <p>Name: ${savedTraveller.name}</p>
            <p>Destination: ${savedTraveller.destination}</p>
            <a href="/">Go back</a>
        `);
    } catch (error) {
        console.error("Error adding traveller:", error.message);
        res.status(500).send("Error adding traveller: " + error.message);
    }
});

// View all travellers
app.get("/travellers", async (req, res) => {
    try {
        const travellers = await Traveller.find();
        res.json(travellers);
    } catch (error) {
        console.error("Error retrieving travellers:", error.message);
        res.status(500).send("Error retrieving travellers.");
    }
});

// Test route
app.get("/ping", (req, res) => {
    res.send("Travel Buddy Finder server is working!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

