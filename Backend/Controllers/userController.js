
import { User } from "../Models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";



export const signup = async (req, res) => {
    try {

        const { name, email, phone, password } = req.body

        if (!name || !email || !phone || !password) {
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }

       const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is alreday exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const role = email === process.env.ADMIN_EMAIL ? "admin" : "user"

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone
        })

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "5d" })

        res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 5 * 24 * 60 * 60 * 1000
            })
            .json({
                success: true,
                responseData: user
            })
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password is required"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isVerify = await bcrypt.compare(password, user.password)

        if (!isVerify) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentails"
            })
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "5d" })

        res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 5 * 24 * 60 * 60 * 1000
            })
            .json({
                success: true,
                responseData: user
            })
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}



export const sendEmail = async (to, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"CareNXT Innovation with care" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        html: `
      <h2>Verify Your Email</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
    });
};



export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min
        await user.save();

        await sendEmail(email, otp);

        res.json({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    if (
        user.otp !== otp ||
        user.otpExpires < Date.now()
    ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
}




export const resendOtp = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: "User already verified" });
    }

    // Limit resend attempts
    if (user.otpResendCount >= 5) {
        return res.status(429).json({
            message: "OTP resend limit reached"
        });
    }

    // Wait time (30 seconds)
    if (
        user.otpLastSentAt &&
        Date.now() - user.otpLastSentAt < 30 * 1000
    ) {
        return res.status(429).json({
            message: "Please wait before resending OTP"
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.otpResendCount += 1;
    user.otpLastSentAt = Date.now();

    await user.save();
    await sendEmail(email, otp);

    res.json({ message: "OTP resent successfully" });
}


