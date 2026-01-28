// src/pages/CheckEmailLoading.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gmailImg from "../../assets/Gmail.png";

const CheckEmailLoading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "your@email.com";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT – Image */}
        <div className="flex justify-center">
          <motion.img
            src={gmailImg}
            alt="Email Verification"
            className="w-[320px] mt-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>

        {/* RIGHT – Content */}
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-600 mb-4">
            Verify your email
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            We’ve sent a verification link to your email address.
            Please open your inbox or spam folder and click the link to activate your account.
          </p>

          <div className="mb-6 rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-indigo-700 font-medium">
            {email}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Waiting for email verification…
          </div>

          <button
            onClick={() => navigate("/login")}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
          >
            Go to Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckEmailLoading;
