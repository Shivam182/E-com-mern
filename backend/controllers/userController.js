const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleWare/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');


// Register new User
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user  =await User.create({
        name,email,password,
        avatar:{
            public_id:'This is a sample id',
            url:'this is s sample url'
        }
    });

   sendToken(user,201,res);



});


// Login User
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{

    const {email,password} =req.body;

    // checking if user has given pass and email both:
    if (!email || !password) {
        return next(new ErrorHandler('Please Enter Email & Password !!',400));
    }

    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password !!',401));
    }

    const isPasswordMatched = user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password !!',401))
    }

    sendToken(user,200,res);
});