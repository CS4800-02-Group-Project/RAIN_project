const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// assignment data test, replace later
app.get("/assignments", (req, res) => {
    res.json({ 
        assignments: [
            { due_date: "2025-03-05", title: "Project Deadline" },
            { due_date: "2025-03-10", title: "Assignment Due" }
        ] 
    });
});

// Fetch assignments from Flask 5000
app.get("/api/assignments", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/assignments"); // Flask should expose this route
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
});

// use postman to test urls
// go to crew directory
// python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
// app:app define <file name>:app

// fastAPI 8000, not quite sure if this is working
// 404 not found
app.post("/api/research", async (req, res) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/research", req.body, {
            headers: { "Content-Type": "application/json" }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching AI response:", error.message);
        res.status(500).json({ error: "Failed to fetch AI response" });
    }
});

// tested and seems to work
app.post("/api/test", async (req, res) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/test"); 
        res.json(response.data); 
    } catch (error) {
        console.error("Error connecting to FastAPI:", error.message);
        res.status(500).json({ error: "Cannot reach FastAPI" });
    }
});

// 404 response if route not found
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});
