const express = require("express");

const app = express();

const PORT = 3000;
const todos = [];

app.get("/", (req, res) => {
    res.json({
        message: "Todo API is running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

app.get("/todos", (req, res) => {
    res.json(todos);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});