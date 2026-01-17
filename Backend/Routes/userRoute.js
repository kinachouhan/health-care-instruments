
import express from "express"
import {sendOtp , verifyOtp , resendOtp , signup , login , logout} from "../Controllers/userController.js"

const router = express.Router()

router.post("/send-otp" , sendOtp)
router.post("/verify-otp" , verifyOtp)
router.post("/resend-otp" , resendOtp)

router.post("/signup" , signup)

router.post("/login" , login)

router.post("/logout", logout);



export default router