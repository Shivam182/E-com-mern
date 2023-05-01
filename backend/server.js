const path = require('path');
const app = require('./app');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
const connectDB = require('./config/database');


// handling uncaught exception : ex-> console.log(shivam) //when shivam is undefined.
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection')
    process.exit(1);
})


// config

dotenv.config({path:'backend/config/config.env'});


// connect to database 

connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.port,()=>{
    console.log('server is running on port: '+ process.env.port);
});


// unhandled promise rejection
process.on('unhandledRejection',(err)=>{
    console.log(err);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1);
    });
})