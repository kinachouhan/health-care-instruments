
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
      
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        
    },
    phone: {
        type: Number,
       
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "admin"
    },
    address: {
        street: String,
        country: String,
        zipcode: Number,
        state: String,
        city: String
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
}, { timestamps: true })


export const User = mongoose.model("User", userSchema)

