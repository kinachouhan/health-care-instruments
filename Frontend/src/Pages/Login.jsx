import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../Components/Logo";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/auth";

import {
  mergeWishList,
  fetchWishList,
} from "../Redux/wishListSlice";

import {
  getGuestWishList,
  clearGuestWishList,
} from "../utils/guestWishList";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(login(formData));

    if (!login.fulfilled.match(result)) {
      console.error("Login failed:", result.payload);
      return;
    }

    const guestWishList = getGuestWishList();

    if (guestWishList.length > 0) {
      try {
        await dispatch(mergeWishList(guestWishList)).unwrap();
        clearGuestWishList();
      } catch (err) {
        console.warn("Wishlist merge failed:", err);
      }
    }

    await dispatch(fetchWishList(true));
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6 flex items-center justify-center gap-2">
          Join
          <span className="w-20">
            <Logo />
          </span>
          Today
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInput}
            className="border px-4 py-2 rounded-lg"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInput}
            className="border px-4 py-2 rounded-lg"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
