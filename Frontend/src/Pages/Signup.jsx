import { Logo } from "../Components/Logo";
import { Link } from "react-router-dom"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { sendOtp } from "../Redux/auth.js";

export const Signup = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {loading }= useSelector(state => state.user);


    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: ""
    })

    const handleInput = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(sendOtp(formData.email));
        if (sendOtp.fulfilled.match(result)) {
            navigate("/verify-otp" , { state: { formData } });
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mb-6 flex items-center justify-center gap-2">
                    Join
                    <span className="inline-flex items-center gap-1">
                        <span className="w-20 sm:w-14 md:w-20">
                            <Logo className="w-full h-auto" />
                        </span>

                    </span>
                    Today
                </p>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            onChange={handleInput}
                            value={formData.name}
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            onChange={handleInput}
                            value={formData.email}
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            onChange={handleInput}
                            value={formData.phone}
                            name="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            onChange={handleInput}
                            value={formData.password}
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-300 shadow-md" >
                        {loading ? "Sending OTP..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline cursor-pointer">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};
