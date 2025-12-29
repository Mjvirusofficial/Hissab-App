import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gmailImg from "../../assets/Gmail.png";

const CheckEmailLoading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🛠️ Logic Fix: Register page se 'email' nikalne ke liye
  const email = location.state?.email || "your@email.com";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT – Image with Animation */}
        <div className="flex justify-center">
          <motion.img
            src={gmailImg}
            alt="Email Verification"
            className="w-[320px] mt-4"
            animate={{ y: [0, -15, 0] }} // Thoda zyada float effect
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* RIGHT – Content */}
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">
            Verify your email
          </h1>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Hissab App mein aapka swagat hai! Humne ek verification link niche diye gaye email par bheja hai:
          </p>

          <div className="mb-6 rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-indigo-700 font-bold text-lg">
            {email}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 font-medium">
            <span className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse"></span>
            Waiting for you to click the link…
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              Go to Login
            </button>
            
            {/* User ki help ke liye ek refresh button */}
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Resend Email?
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckEmailLoading;