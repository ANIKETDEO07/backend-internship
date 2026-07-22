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

// Update Task
app.put("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const task = tasks.find((task) => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    const { title, done } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    if (typeof done !== "boolean") {
        return res.status(400).json({
            error: "Done must be true or false"
        });
    }

    task.title = title;
    task.done = done;

    res.status(200).json(task);
});
// Delete Task
app.delete("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    tasks.splice(taskIndex, 1);

    res.status(204).send();
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});