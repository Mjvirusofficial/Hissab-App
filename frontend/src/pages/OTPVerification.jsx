import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../api/allApi"; // Jo function humne abhi api file mein add kiya
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";

function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Register page se email yahan pass hokar aayega
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email address not found. Please register again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await verifyOTP({ email, otp });
      
      if (response.success) {
        // Token save karein aur home par bhej dein
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/"); 
      }
    } catch (err) {
      setError(err.message || "Invalid or Expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full border border-gray-100 rounded-2xl shadow-2xl p-8 bg-white"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={40} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>
          <p className="text-gray-500 mt-2">
            We've sent a 6-digit code to <br />
            <span className="font-semibold text-indigo-600">{email || "your email"}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block text-center">
              Enter OTP Code
            </label>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full text-center text-4xl tracking-[1rem] font-bold p-4 border-2 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all
              ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200"}`}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <button 
          onClick={() => navigate("/register")}
          className="mt-8 flex items-center justify-center w-full text-sm text-gray-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Registration
        </button>
      </motion.div>
    </div>
  );
}

export default OTPVerification;