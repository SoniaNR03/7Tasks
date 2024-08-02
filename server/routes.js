const express = require('express');

const route = express.Router();

// GET
route.get('/todos', (req, res) => {
    res.status(200).json({ message: 'GET REQUEST TO /api/todos' });
});

// POST
route.post('/todos', (req, res) => {
    // 201 creation of something
    res.status(201).json({ message: 'POST REQUEST TO /api/todos' });
});

// PUT
route.put('/todos/:id', (req, res) => {
    res.status(200).json({ message: 'PUT REQUEST TO /api/todos/:id' });
});

// DELETE
route.delete('/todos/:id', (req, res) => {
    res.status(200).json({ message: 'DELETE REQUEST TO /api/todos/:id' });
});

module.exports = route;