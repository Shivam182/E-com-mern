const express = require('express');

const app = express();

const errorMiddleware = require('./middleWare/error');
app.use(express.json());

// Route imports 
const product  = require('./routes/productRoute');


app.use('/api/v1',product);

// error middleware
app.use(errorMiddleware);

module.exports = app;
