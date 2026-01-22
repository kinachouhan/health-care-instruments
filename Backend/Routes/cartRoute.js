import express from "express";
import {
  getMyCart,
  addToCart,
  removeFromCart,
  clearCart,
} from  "../Controllers/cartController.js";


import { authMiddleware } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/", authMiddleware, getMyCart);
router.post("/add", authMiddleware, addToCart);
router.delete("/remove", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);


export default router;