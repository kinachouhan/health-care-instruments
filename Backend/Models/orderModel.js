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
        productName: String,
        price: Number,
        quantity: {
          type: Number,
          min: 1,
        },
        images: [String],
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

    paymentDetails: {
      transactionId: {
        type: String,
        required: function () {
          return this.paymentMethod === "UPI";
        },
      },
      status: {
        type: String,
        enum: ["pending", "verified"],
        default: "pending",
      },
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

    deliveryAddress: {
      fullName: String,
      address1: String,
      address2: String,
      city: String,
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
