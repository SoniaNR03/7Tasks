const express = require('express');


const app = express();

const router = require('./routes');
// all routes start with /api 
app.use('/api', router);
// TODO: select a port
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});