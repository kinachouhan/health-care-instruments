import { Link } from "react-router-dom";
import { Logo } from "../Components/Logo";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../Redux/auth";
import { useNavigate } from "react-router-dom"

export const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login(formData));
        if (login.fulfilled.match(result)) {
            const user = result.payload;
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } else {
            console.error("Login failed:", result.payload);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-500 mb-6 flex items-center justify-center gap-2">
                    Join
                    <span className="inline-flex items-center gap-1">
                        <span className="w-20 sm:w-18 md:w-20">
                            <Logo className="w-full h-auto" />
                        </span>
                    </span>
                    Today
                </p>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            value={formData.email}
                            onChange={handleInput}
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            value={formData.password}
                            onChange={handleInput}
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="text-right text-sm">
                        <span className="text-blue-600 hover:underline cursor-pointer">
                            Forgot password?
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-300 shadow-md"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline cursor-pointer">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
