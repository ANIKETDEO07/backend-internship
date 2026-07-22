const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Port
const PORT = 3000;

// In-memory task list
const tasks = [];

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "Task API is running"
    });
});

// Health Route
app.get("/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

// Get All Tasks
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// Create Task
app.post("/tasks", (req, res) => {

    const { title } = req.body;

    // Validation
    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        title: title,
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});