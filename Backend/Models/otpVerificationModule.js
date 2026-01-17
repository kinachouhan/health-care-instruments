
import mongoose from "mongoose"

const otpVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
     otp: String,
    otpExpires: Date,

    otpResendCount: {
        type: Number,
        default: 0
    },
    otpLastSentAt: Date,
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export const OtpVerification = mongoose.model("OtpVerification", otpVerificationSchema)