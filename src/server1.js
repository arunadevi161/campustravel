
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

// Campus Club Member Schema
const memberSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    club: {
        type: String,
        required: true
    }
});

// Model
const Member = mongoose.model("Member", memberSchema);

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Add a member
app.post("/members", async (req, res) => {
    try {
        console.log("\n========== NEW CLUB MEMBER ==========");
        console.log("Received form details:", req.body);

        const { studentId, name, department, year, club } = req.body;

        if (!studentId || !name || !department || !year || !club) {
            console.log("Error: Some fields are missing.");
            return res.status(400).send("Please fill in all fields.");
        }

        const member = new Member({
            studentId,
            name,
            department,
            year: Number(year),
            club
        });

        const savedMember = await member.save();

        console.log("Member saved successfully!");
        console.log(savedMember);
        console.log("====================================\n");

        res.send(`
            <h2>Member added successfully!</h2>
            <p>Name: ${savedMember.name}</p>
            <p>Student ID: ${savedMember.studentId}</p>
            <a href="/">Go back</a>
        `);
    } catch (error) {
        console.error("Error adding member:", error.message);
        res.status(500).send("Error adding member: " + error.message);
    }
});

// View all members
app.get("/members", async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        console.error("Error retrieving members:", error.message);
        res.status(500).send("Error retrieving members.");
    }
});

// Test route
app.get("/ping", (req, res) => {
    res.send("Campus Club Members server is working!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
