import express from "express";
import {
  placeOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  verifyUpiPayment,
} from "../Controllers/orderController.js";

import { authMiddleware } from "../Middleware/authMiddleware.js";
import { adminMiddleware } from "../Middleware/adminMiddleware.js";

const router = express.Router();
router.post("/place-order", authMiddleware, placeOrder);
router.get("/orders", authMiddleware, getUserOrders);
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:orderId/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.put(
  "/:orderId/verify-payment",
  authMiddleware,
  adminMiddleware,
  verifyUpiPayment
);

export default router;
