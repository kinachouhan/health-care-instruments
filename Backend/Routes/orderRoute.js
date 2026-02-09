import express from "express"
import { placeOrder , getAllOrders , getUserOrders , updateOrderStatus } from "../Controllers/orderController"
import {authMiddleware} from "../Middleware/authMiddleware"

const router = express.Router()


router.post("/place-order" , authMiddleware , placeOrder)
router.get("/orders" , authMiddleware,  getUserOrders)
router.get("/" ,authMiddleware ,  getAllOrders)
router.put("/:orderId/status" , authMiddleware ,  updateOrderStatus)


export default router