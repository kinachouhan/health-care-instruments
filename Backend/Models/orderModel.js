import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        images: {
          type: [String],
          default: [],
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: [
        "Order-Placed",
        "Pending",
        "Shipping",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Order-Placed",
    },

    userData: {
      fullName: String,
      Address1: String,
      Address2: String,
      state: String,
      zipcode: String,
      country: String,
      phone: String,
      email: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
