import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resendOtp, signup } from "../Redux/auth";
import { useNavigate, useLocation } from "react-router-dom";

export const VerifyOtp = () => {
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.user);

  // get formData passed from Signup
  const formData = location.state?.formData;

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const result = await dispatch(verifyOtp({ email: formData.email, otp }));
    if (verifyOtp.fulfilled.match(result)) {
      // after OTP verified, create account
      await dispatch(signup(formData));
      navigate("/");
    }
  };

  const handleResend = async () => {
    await dispatch(resendOtp(formData.email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
          Verify OTP
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter the 6-digit OTP sent to {formData?.email}
        </p>

        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>


        <p className="text-center text-gray-500 text-sm mt-4">
          Didn’t receive the code?{" "}
          <span
            onClick={handleResend}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};
