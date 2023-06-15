const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleWare/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

// create a product: ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

  let images = [];

  if(typeof req.body.images === 'string') {
    images.push(req.body.images);

  }else{
    images = req.body.images;
  }

  const imagesLink = [];

  for(let i =0; i< images.length; i++){
    const result = await cloudinary.v2.uploader.upload(images[i],{
      folder:'products',
    });

    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLink;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res
    .status(200)
    .json({
      message: "Product successfully created",
      success: true,
      product: product,
    });
});

// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // Testing how front-end shows error ...failed!!
  // return next(new ErrorHandler('This is myn temp. Error.',500));

  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();
  
  const apifeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    var products = await apifeatures.query;

    var filteredProductsCount = products.length;
  
    apifeatures.pagination(resultPerPage);

    // uncommenting this gives an internal server error ?
    // products = await apifeatures.query;

  res
    .status(200)
    .json({ success: true, products: products, productsCount ,resultPerPage,filteredProductsCount});
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// get single product by ID
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found !!", 404));
  }

  res.json({
    success: true,
    product: product,
  });
});

// update product: ADMIN
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  // console.log('product not found !!')
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(500).json({
      success: false,
      message: "Product Not Found",
    });

    return;
  }

  // Images start here 
  let images = [];

  if( typeof req.body.images === 'string'){
    images.push(req.body.images);
  }else{
    images = req.body.images;
  }

  if(images !== undefined){

    // Deleting images from cloudinary
    for(let i= 0; i <product.images.length; i++){
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);

    }


    const imagesLink = [];

    for(let i = 0; i<images.length; i++){
      const result = await cloudinary.v2.uploader.upload(images[i],{
        folder:'products',
      });

      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });


    }

    req.body.images = imagesLink;

  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidation: true,
    useFindAndModify: true,
  });

  res
    .status(200)
    .json({
      success: true,
      message: "Product Updated Successfully !!",
      updated_product: product,
    });
});

// delete product: ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "Product Not Found" });
  }

  // Deleting images from cloudinary 
  for(let i =0; i < product.images.length; i++){
    await cloudinary.v2.uploader.destroy(product.images[i].public_id)
  }

  await product.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully !!" });
});

// Create a new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    ratings: Number(rating),
    comment: comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.ratings = product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler(`Product Not Found !!`, 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete A Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler(`Product Not Found`, 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if(reviews.length === 0){
    ratings = 0;
  }else{
    ratings = avg / reviews.length;

  }

  const numOfReviews = reviews.length;

  await product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
