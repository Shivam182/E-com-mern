const express = require('express');

const app = express();

const errorMiddleware = require('./middleWare/error');
app.use(express.json());

// Route imports 
const product  = require('./routes/productRoute');
const user  = require('./routes/userRoute');

app.use('/api/v1',product);
app.use('/api/v1',user);


// error middleware
app.use(errorMiddleware);

module.exports = app;
