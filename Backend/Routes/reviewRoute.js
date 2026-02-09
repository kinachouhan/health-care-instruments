import express from "express"
import { submitReview , getProductReviews , getUserReview } from "../Controllers/reviewController.js"
import {authMiddleware} from "../Middleware/authMiddleware.js"

const router = express.Router()


router.post("/" , authMiddleware, submitReview)
router.get("/user/:productId" , authMiddleware ,  getUserReview)
router.get("/:productId" , getProductReviews)

export default router
