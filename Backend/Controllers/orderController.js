import { Order } from "../Models/orderModel.js";


export const placeOrder = async (req, res) => {
  try {
    const orderData = req.body;

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    const paymentStatus =
      orderData.paymentMethod === "COD" ? "pending" : "completed";

    const newOrder = new Order({
      ...orderData,
      userId: req.user._id,
      paymentStatus,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Order has been placed",
      responseData: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    if (order.paymentMethod === "COD") {
      order.paymentStatus =
        status === "Delivered" ? "completed" : "pending";
    } else {
      order.paymentStatus = "completed";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Updated Order Status",
      responseData: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.productId")
      .populate("userId");

    res.status(200).json({
      success: true,
      message: "Fetched All Orders Details",
      responseData: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      responseData: orders,
      message: "Fetched User Orders",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
    });
  }
};
