
import { User } from "../Models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
import { OtpVerification } from "../Models/otpVerificationModule.js";



export const signup = async (req, res) => {
    try {

        const { name, email, phone, password } = req.body

        if (!name || !email || !phone || !password) {
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }

        const otpRecord = await OtpVerification.findOne({ email });
        if (!otpRecord || !otpRecord.isVerified) {
            return res.status(400).json({ success: false, message: "Email not verified" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is alreday exist"
            })
        }

        console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
        const hashedPassword = await bcrypt.hash(password, 10)

        const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";


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

        return res.status(200)
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
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OtpVerification.findOneAndUpdate(
            { email },
            {
                otp, otpExpires: Date.now() + 5 * 60 * 1000,
                otpResendCount: 0,
                otpLastSentAt: Date.now(),
                isVerified: false
            },
            { upsert: true, new: true });
        await sendEmail(email, otp);
        res.json({ success: true, message: "OTP sent successfully" });
    }
    catch (error) {
        console.error(error); res.status(500).json({ success: false, message: "Server error" });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const record = await OtpVerification.findOne({ email });



    if (!record) {
        return res.status(400).json({ message: "No Otp record found" });
    }

    if (
        record.otp !== otp ||
        record.otpExpires < Date.now()
    ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    record.isVerified = true;
    record.otp = null;
    record.otpExpires = null;
    await record.save();
    res.json({ message: "OTP verified successfully" });
}

export const resendOtp = async (req, res) => {
    const { email } = req.body;

    const record = await OtpVerification.findOne({ email });

    if (!record) {
        return res.status(404).json({ message: "User not found" });
    }

    if (record.isVerified) {
        return res.status(400).json({ message: "User already verified" });
    }


    if (record.otpResendCount >= 5) {
        return res.status(429).json({
            message: "OTP resend limit reached"
        });
    }

    if (
        record.otpLastSentAt &&
        Date.now() - record.otpLastSentAt < 30 * 1000
    ) {
        return res.status(429).json({
            message: "Please wait before resending OTP"
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    record.otp = otp;
    record.otpExpires = Date.now() + 5 * 60 * 1000;
    record.otpResendCount += 1;
    record.otpLastSentAt = Date.now();


    await record.save();
    await sendEmail(email, otp);
    res.json({ message: "OTP resent successfully" });
}

export const logout = (req, res) => {
    try {
        res
            .status(200)
            .cookie("token", "", {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                expires: new Date(0)
            })
            .json({
                success: true,
                message: "Logged out successfully!"
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId).select("-password");

        return res.status(200).json({
            success: true,
            responseData: user
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}




export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* ================= BASIC FIELDS ================= */
    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }

    if (req.body.phone !== undefined) {
      user.phone = req.body.phone;
    }

    /* ================= ADDRESS (PARTIAL MERGE) ================= */
    if (!user.address) {
      user.address = {};
    }

    if (req.body.street !== undefined) {
      user.address.street = req.body.street;
    }

    if (req.body.city !== undefined) {
      user.address.city = req.body.city;
    }

    if (req.body.state !== undefined) {
      user.address.state = req.body.state;
    }

    if (req.body.country !== undefined) {
      user.address.country = req.body.country;
    }

    if (req.body.zipcode !== undefined) {
      user.address.zipcode = req.body.zipcode;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: user.toObject({ versionKey: false })
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
