const express = require("express");
const router = express.Router();

const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    return client.db("todosdb").collection("todos");

}

// GET
router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
});

// POST
router.post('/todos', async (req, res) => {
    // 201 creation of something
    const collection = getCollection();
    let { todo } = req.body; // extract the todo from the request body(the property todo of the json format)

    if (!todo) {
        return res.status(400).json({ error: "No ToDo Found" });
    }

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

    const newTodo = await collection.insertOne({ todo, status: false });


    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// PUT
router.put('/todos/:id', async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status, todo } = req.body;

    if (typeof status !== 'boolean') {
        return res.status(400).json({ error: "Invalid Status, Not Boolean" });
    } else if (!todo || typeof todo !== 'string') {
        return res.status(400).json({ error: "ToDo Not valid" });
    }
    const updatedTodo = await collection.updateOne({ _id }, { $set: { status: !status, todo } });
    res.status(200).json(updatedTodo);





});

// DELETE
router.delete('/todos/:id', async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const deletedTodo = await collection.deleteOne({ _id });


    res.status(200).json(deletedTodo);
});

module.exports = router;