
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
        default: "user"
    },
    address: {
        street: String,
        country: String,
        zipcode: Number,
        state: String,
        city: String
    }
}, { timestamps: true })


export const User = mongoose.model("User", userSchema)

