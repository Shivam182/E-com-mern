const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleWare/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail  = require('../utils/sendEmail');

const cloudinary =  require('cloudinary');

// Register new User
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:'avatars',
        width:150,
        crop:'scale',
    });

    const {name,email,password} = req.body;
    const user  =await User.create({
        name,email,password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

   sendToken(user,201,res);
});


// Login User
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    console.log('here')

    const {email,password} =req.body;

    // checking if user has given pass and email both:
    if (!email || !password) {
        return next(new ErrorHandler('Please Enter Email & Password !!',400));
    }

    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password !!',401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password !!',401))
    }

    sendToken(user,200,res);
});


// Logout user 
exports.logout = catchAsyncErrors(async (req,res,next)=>{

    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:'Logged Out Successfully !!'
    })
});


// forgot password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    // console.log('here working');
    const user  = await User.findOne({email:req.body.email});
    // console.log('user: '+user);
    if (!user) {
        
        return next(new ErrorHandler('User not found !!',404));
    }

    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordURL = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`


    const message = `Your password reset token is :- \n\n ${resetPasswordURL} \n\nIf you have not requested this email then please ignore it.`;

    try {

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({success:true,message:`Email sent to ${user.email} successfully.`})
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message));
    }
});


// Reset Error 
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    // creating token hash
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); 

    
    const user = await User.findOne({
        resetPasswordToken,resetPasswordExpire:{$gt:Date.now()},
    });

    if (!user) {
        return next(new ErrorHandler('Reset Password Token is invalid or has been expired.',400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res);
});



// Get user details 
exports.getUserDetails =  catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

   res.status(200).json({
    success:true,
    user:user
   })
});


// update user password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldpassword);

    if (!isPasswordMatched) {

        return next(new ErrorHandler('Old Password is Incorrect.',401));
        
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match0,400'));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);

    res.status(200).json({
        success:true,

    })

});

// update user profile 
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
    }

    if (req.body.avatar !== "") {
        const user =  await User.findById(req.body.id);
        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:'avatars',
            width:150,
            crop:'scale',
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }

        
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators: true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true
    });

});


// Get any users : ADMIN 
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();


    res.status(200).json({
        success:true,
        users
    })

});

// Get a single user
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with id: ${req.params.id}`)
        );
    }

    res.status(200).json({
        success:true,
        user,
    });
});




// Issue : this updates the logged in user that is the admin trying to do the update itself .
// update user ROLE: ADMIN
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const newUserData ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators: true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true
    });

});



// delete user : ADMIN
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
   
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`))
    }

    await user.deleteOne();

    res.status(200).json({
        success:true
    });

});
