import { Review } from "../Models/reviewModel.js";
import { Order } from "../Models/orderModel.js";
import mongoose from "mongoose";



export const submitReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Product and rating are required",
      });
    }
    const hasOrdered = await Order.findOne({
      userId,
      "items.productId": new mongoose.Types.ObjectId(productId),
      status: { $ne: "Cancelled" },
    });

    if (!hasOrdered) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have purchased",
      });
    }

    let review = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = await Review.create({
        user: userId,
        product: productId,
        ratings: rating,
        comments: comment,
      });
    }

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      responseData: review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};


export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Fetched product reviews",
      count: reviews.length,
      responseData: reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product reviews",
    });
  }
};


export const getUserReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const review = await Review.findOne({
      user: userId,
      product: productId,
    });

    res.status(200).json({
      success: true,
      message: "Fetched user review",
      responseData: review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get user review",
    });
  }
};


export const canUserReviewProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const order = await Order.findOne({
      userId,
      "items.productId": new mongoose.Types.ObjectId(productId),
      status: { $ne: "Cancelled" },
    });

    res.status(200).json({
      success: true,
      message: "Review permission checked",
      responseData: !!order, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to check review permission",
    });
  }
};
