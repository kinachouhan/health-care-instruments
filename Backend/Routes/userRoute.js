
import express from "express"
import {sendOtp , verifyOtp , resendOtp , signup , login , logout, getMe, updateProfile} from "../Controllers/userController.js"
import { authMiddleware } from "../Middleware/authMiddleware.js"

const router = express.Router()

router.post("/send-otp" , sendOtp)
router.post("/verify-otp" , verifyOtp)
router.post("/resend-otp" , resendOtp)

router.post("/signup" , signup)

router.post("/login" , login)

router.post("/logout", logout);

router.get("/me", authMiddleware , getMe)

router.put("/profile", authMiddleware, updateProfile);




export default router