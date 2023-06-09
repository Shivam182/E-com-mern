const express = require('express');
const dotenv  = require('dotenv');

// Config
dotenv.config({path: 'backend/config/config.env'})

const app = express();


const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middleWare/error');
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser());
app.use(fileUpload());

// Route imports 
const product  = require('./routes/productRoute');
const user  = require('./routes/userRoute');
const order =  require('./routes/orderRoute');
const payment =  require('./routes/paymentRoute');


app.use('/api/v1',product);
app.use('/api/v1',user);
app.use('/api/v1',order);
app.use('/api/v1',payment);


// error middleware
app.use(errorMiddleware);

module.exports = app;
