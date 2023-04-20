const mongoose = require('mongoose')



const connectDB =()=>{
    
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then((data)=>{
    console.log('mongoDB connected with server: '+ data.connection.host)
}).catch((err)=>{console.log('Some issue occcured ' +err)});
}

module.exports = connectDB;