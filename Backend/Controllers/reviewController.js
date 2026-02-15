import { Review } from "../Models/reviewModel.js";
import { Order } from "../Models/orderModel.js";


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
      status: "Delivered",
      "items.productId": productId,
    });

    if (!hasOrdered) {
      return res.status(403).json({
        success: false,
        message: "Only verified purchasers can submit reviews.",
      });
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json({
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

    console.log("User ID:", userId);
    console.log("Product ID:", productId);

    const orders = await Order.find({ userId });
    console.log("All user orders:", orders);

    const deliveredOrders = await Order.find({
      userId,
      status: "Delivered",
    });
    console.log("Delivered Orders:", deliveredOrders);

    const order = await Order.findOne({
      userId,
      status: "Delivered",
      "items.productId": productId,
    });

    console.log("Matched Order:", order);

    res.json({
      success: true,
      responseData: !!order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};


