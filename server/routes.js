const express = require("express");
const router = express.Router();

const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    return client.db("todosdb").collection("todos");
}

const fill_days = async (collection, todos) => {
    if (todos.length !== 7) {
        for (let i = 0; i < 7; i++) {
            if (!todos[i]) {
                await collection.insertOne({ todo: "", status: false });
            }
        }
    }
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

    date = date ? new Date(date) : null;
    if (!date) {
        return res.status(400).json({ error: "Date is required" });
    }
    else if (date < new Date()) {
        return res.status(400).json({ error: "Late date" });
    }
    const transformDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    const newDay = await collection.insertOne({ _id: transformDate(date), todos: new Array(7).fill(null).map((_, index) => ({ index: index, todo: "", status: false, })) });
    res.status(201).json(newDay);
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

