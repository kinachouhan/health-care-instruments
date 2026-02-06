import express from "express";
import {
  getMyWishList,
 addtoWishList,
  removeFromWishList,
  clearWishList,
  mergeGuestWishList
} from  "../Controllers/wishlistController.js"

import { authMiddleware } from "../middleware/authMiddleware.js"; 



const router = express.Router();

router.get("/", authMiddleware ,  getMyWishList);
router.post("/add",authMiddleware ,  addtoWishList);
router.delete("/remove",authMiddleware , removeFromWishList);
router.delete("/clear", authMiddleware ,clearWishList);
router.post("/merge" , authMiddleware , mergeGuestWishList)


export default router;