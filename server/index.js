require('dotenv').config();
const express = require('express');
const { connectToMongoDB } = require('./database');


const app = express();
app.use(express.json());

const router = require('./routes');

// all routes start with /api 
app.use('/api', router);
// TODO: select a port
const PORT = process.env.PORT || 5000; // 5000 is the default port in case env doesnt work

async function startServer() {
    await connectToMongoDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
startServer();