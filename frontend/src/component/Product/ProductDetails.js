import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { Rating } from "@material-ui/lab";
import ReviewCard from "./ReviewCard.js";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import "./ProductDetails.css";


const ProductDetails = () => {
  const { id } = useParams();
  const alert = useAlert();

  const dispatch = useDispatch();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const options = {
    size: "large",
    value: 2.2,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item Added To Cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [id, dispatch, error, alert]);

  return (
    <Fragment>
      {product && (
        <>
          <Fragment>
            {loading ? (
              <Loader />
            ) : (
              <Fragment>
                <div className="ProductDetails">
                  <div>
                    <Carousel className="Carousel">
                      
                      {product &&
                        product.images.map((item, i) => (
                          <img
                            className="CarouselImage"
                            key={item.url}
                            src={item.url}
                            alt={`${i} Slide`}
                          />
                        ))}
                    </Carousel>
                  </div>

                  <div>
                    <div className="detailsBlock-1">
                      {product && (
                        <>
                          <h2>{product.name}</h2>
                          <p>Product # {product._id}</p>
                        </>
                      )}
                    </div>

                    <div className="detailsBlock-2">
                      <Rating {...options} value={product.rating} />
                      <span className="detailsBlock-2-span">
                        {" "}
                        ({product.numOfReviews} Reviews)
                      </span>
                    </div>
                    <div className="detailsBlock-3">
                      <h1>{`₹${product.price}`}</h1>
                      <div className="detailsBlock-3-1">
                        <div className="detailsBlock-3-1-1">
                          <button onClick={decreaseQuantity}>-</button>
                          <input readOnly type="number" value={quantity} />
                          <button onClick={increaseQuantity}>+</button>
                        </div>
                        <button
                          disabled={product.Stock < 1 ? true : false}
                          onClick={addToCartHandler}
                        >
                          Add to Cart
                        </button>
                      </div>

                      <p>
                        Status:
                        <b
                          className={
                            product.Stock < 1 ? "redColor" : "greenColor"
                          }
                        >
                          {product.Stock < 1 ? "OutOfStock" : "InStock"}
                        </b>
                      </p>
                    </div>

                    <div className="detailsBlock-4">
                      Description : <p>{product.description}</p>
                    </div>

                    <button
                      onClick={submitReviewToggle}
                      className="submitReview"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
                <h3 className="reviewsHeading">REVIEWS</h3>

                <Dialog
                  aria-labelledby="simple-dialog-title"
                  open={open}
                  onClose={submitReviewToggle}
                >
                  <DialogTitle>Submit Review</DialogTitle>
                  <DialogContent className="submitDialog">
                    <Rating
                      onChange={(e) => setRating(e.target.value)}
                      value={rating}
                      size="large"
                    />

                    <textarea
                      className="submitDialogTextArea"
                      cols="30"
                      rows="5"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={submitReviewToggle} color="secondary">
                      Cancel
                    </Button>
                    <Button onClick={reviewSubmitHandler} color="primary">
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>

                {product && product.reviews[0] ? (
                  <div className="reviews">
                    {product.reviews &&
                      product.reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                      ))}
                  </div>
                ) : (
                  <p className="noReviews">No Reviews Yet</p>
                )}
              </Fragment>
            )}
          </Fragment>
        </>
      )}
    </Fragment>
  );
};

export default ProductDetails;
