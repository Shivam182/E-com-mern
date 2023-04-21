const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Enter Your Name.'],
        maxLength:[30,'Name cannot exceed 30 characters.'],
        minLength:[4,'Name should be atleast 4 characters long.']
    },

    email:{
        type:String,
        required:[true,'Please Enter Your Email.'],
        unique:true,
        validate:[validator.isEmail,'Please Enter A Valid Email.']
    },
    password:{
        type:String,
        required:[true,'Please Enter Your Password.'],
        minLength:[8,'Password Must be atleast 8 characters long.'],
        select:false  
    },
    avatar:{
        
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            
        }
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre('save',async function(next){

    if (!this.isModified('password')) {

        next();
        
    }

    this.password = await bcryptjs.hash(this.password,10);
});

// Jwt TOKEN
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
};

// password comparer
userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password);
}


module.exports = mongoose.model('User',userSchema);