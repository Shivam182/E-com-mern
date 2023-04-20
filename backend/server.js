const path = require('path');
const app = require('./app');
const dotenv = require('dotenv');

const connectDB = require('./config/database');

// config

dotenv.config({path:'backend/config/config.env'});


// connect to database 

connectDB();

app.listen(process.env.port,()=>{
    console.log('server is running on port: '+ process.env.port);
});