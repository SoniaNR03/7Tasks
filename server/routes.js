const express = require("express");

const router = express.Router();

// GET
router.get("/todos", (req, res) => {
    res.status(200).json({ msg: "GET REQUEST TO /api/todos" });
});

// POST
router.post('/todos', (req, res) => {
    // 201 creation of something
    res.status(201).json({ msg: 'POST REQUEST TO /api/todos' });
});

// PUT
router.put('/todos/:id', (req, res) => {
    res.status(200).json({ msg: 'PUT REQUEST TO /api/todos/:id' });
});

// DELETE
router.delete('/todos/:id', (req, res) => {
    res.status(200).json({ msg: 'DELETE REQUEST TO /api/todos/:id' });
});

module.exports = router;