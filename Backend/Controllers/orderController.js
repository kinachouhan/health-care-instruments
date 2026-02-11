import { Order } from "../Models/orderModel.js";
import { Product } from "../Models/productModel.js";

export const placeOrder = async (req, res) => {
  try {
    const orderData = req.body.orderData || req.body; 

    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    const newOrder = new Order({
      ...orderData,
      userId: req.user._id,
      paymentStatus:
        orderData.paymentMethod === "COD" ? "pending" : "pending",
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
  const { status } = req.body;

  const order = await Order.findById(req.params.orderId).populate(
    "items.productId"
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  if (order.status === "Delivered") {
    return res.status(400).json({
      success: false,
      message: "Order already delivered",
    });
  }

  if (
    status === "Delivered" &&
    order.paymentMethod === "UPI" &&
    order.paymentStatus !== "completed"
  ) {
    return res.status(400).json({
      success: false,
      message: "UPI payment not verified yet",
    });
  }

  order.status = status;

  if (order.paymentMethod === "COD" && status === "Delivered") {
    order.paymentStatus = "completed";
  }


  if (status === "Delivered") {
    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }
  }

  await order.save();

  res.json({
    success: true,
    responseData: order,
  });
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


export const verifyUpiPayment = async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  if (order.paymentMethod !== "UPI") {
    return res.status(400).json({
      success: false,
      message: "Not a UPI order",
    });
  }

  order.paymentDetails.status = "verified";
  order.paymentStatus = "completed";

  await order.save();

  res.json({
    success: true,
    message: "UPI payment verified successfully",
    responseData: order,
  });
};

