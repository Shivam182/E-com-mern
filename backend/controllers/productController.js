const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleWare/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');

// create a product: ADMIN
exports.createProduct = catchAsyncErrors( async (req,res,next)=>{
    const product = await Product.create(req.body);

    res.status(200).json({message:'Product successfully created',success:true,product:product})
})


// get all products
exports.getAllProducts = catchAsyncErrors(async (req,res) =>{
    // console.log('hello')

  const apifeatures = new ApiFeatures(Product.find(),req.query).search().filter();
  const products =   await apifeatures.query;

  res.status(200).json({success:true,products:products});
})


// get single product by ID
exports.getProductDetails = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if (!product) { 
        
        return next(new ErrorHandler('Product Not Found !!',404));
    }


    res.json({
        success:true,
        product:product
    });


})


// update product: ADMIN
exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{

    // console.log('product not found !!')
    let product = await Product.findById(req.params.id);
    if (!product) {
        
         res.status(500).json({
            success:false,
            message:'Product Not Found'
        });

        return;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidation:true,useFindAndModify:true});

    res.status(200).json({success:true,message:'Product Updated Successfully !!',updated_product:product})
})


// delete product: ADMIN
exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product =  await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({success:false,message:'Product Not Found'});
    }

    await product.deleteOne();


    res.status(200).json({success:true,message:'Product deleted successfully !!'})
})