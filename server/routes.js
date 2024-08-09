const express = require("express");
const router = express.Router();

const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    return client.db("todosdb").collection("todos");
}


// GET
router.get("/todos/:date", async (req, res) => {
    const date = req.params.date;
    const collection = getCollection();
    const todosForDate = await collection.findOne({ _id: date });
    if (!todosForDate) {
        return res.status(404).json({ error: "Not Found" });
    }
    return res.status(200).json(todosForDate);
});

// POST
router.post('/todos', async (req, res) => {
    // 201 creation of something
    const collection = getCollection();
    let { date } = req.body; // extract the todo from the request body(the property todo of the json format)

    const strToDate = (date) => {
        if (!date) {
            return res.status(400).json({ error: "Date is required" });
        }

        const [day, month, year] = date.split(".");
        return new Date(year, month - 1, day);
    }

    dateFormat = strToDate(date);

    if (dateFormat < new Date()) {

        return res.status(400).json({ error: "Late date" });
    }
    const newDay = await collection.insertOne({ _id: date, todos: new Array(7).fill(null).map((_, index) => ({ index: index, todo: "", status: false, })) });
    return res.status(201).json(newDay);
});

// PUT change status
router.put('/todos/:id/status/:index', async (req, res) => {
    const collection = getCollection();
    const _id = req.params.id;
    const index = parseInt(req.params.index);
    const { status } = req.body;

    if (typeof status !== 'boolean') {
        return res.status(400).json({ error: "Invalid Status, Not Boolean" });
    }
    const updatedTodo = await collection.updateOne(
        { _id },
        { $set: { [`todos.${index}.status`]: !status } }
    );
    res.status(200).json(updatedTodo);
});

// PUT change todo
router.put('/todos/:id/todo/:index', async (req, res) => {
    const collection = getCollection();
    const _id = req.params.id;
    const index = parseInt(req.params.index);
    const { todo } = req.body;
    // if (!ObjectId.isValid(_id)) {
    //     return res.status(400).json({ error: "Invalid ID format" });
    // }

    if (!todo || typeof todo !== 'string') {
        return res.status(400).json({ error: "ToDo Not valid" });
    }
    const updatedTodo = await collection.updateOne(
        { _id },
        { $set: { [`todos.${index}.todo`]: todo } }
    );
    return res.status(200).json(updatedTodo);

});

// DELETE
router.delete('/todos/:id', async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const deletedTodo = await collection.deleteOne({ _id });


    res.status(200).json(deletedTodo);
});

module.exports = router;

