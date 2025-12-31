import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/allApi";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, TrendingUp, AlertCircle } from "lucide-react"; 
import img1 from '../assets/loiniff.gif';

// --- Animation Variants ---
const mainContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const sectionItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const formItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUnverified, setIsUnverified] = useState(false); // New state for verification check

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      setIsUnverified(false);
      
      const response = await loginUser({
        email: data.email,
        password: data.password
      });

      if (response.success) {
        // Data already saved in allApi.js logic, just navigate
        navigate("/"); 
      } else {
        setError(response.message);
      }
    } catch (err) {
      /* =============================================================
          🔗 UNVERIFIED USER LOGIC (FIXED)
          Ab hum OTP page par nahi bhejenge, balki wahi par ek 
          "Verify your email" ka message dikhayenge.
         ============================================================= */
      if (err.response?.status === 401 || err.message?.toLowerCase().includes("verify")) {
        setIsUnverified(true);
        setError("आपका ईमेल वेरीफाई नहीं है। कृपया अपने इनबॉक्स में जाकर लिंक पर क्लिक करें।");
        return;
      }

      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      className="min-h-screen flex flex-col md:flex-row w-full bg-white" 
      variants={mainContainer}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Image Section */}
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white md:h-screen" 
        variants={sectionItem}
      >
        <div className="text-center max-w-lg">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-6 uppercase">
                Welcome Back <br /> 
                Hisab Kitab Ki Duniya
            </h3>
            
            <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="w-full h-[400px] sm:h-[500px] max-h-[60vh] overflow-hidden rounded-xl shadow-xl border-4 border-gray-100" 
            >
                <img src={img1} alt="Login Animation" className="w-full h-full object-contain" />
            </motion.div>
            
            <p className="mt-6 text-base text-gray-600 flex items-center justify-center font-medium">
                <TrendingUp size={20} className="mr-2 text-indigo-600" />
                Your platform for seamless management.
            </p>
        </div>
      </motion.div>

      {/* 2. Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white">
          <div className="w-full max-w-md">
              <motion.h1 className="text-4xl font-bold text-gray-900 mb-2" variants={formItem}>Sign In</motion.h1>
              <motion.p className="text-gray-500 mb-10 text-lg" variants={formItem}>Enter your details to access your account.</motion.p>

              {error && (
                  <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`mb-6 p-4 rounded-lg flex items-start gap-3 text-sm font-medium border ${
                        isUnverified ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-red-50 text-red-700 border-red-200"
                      }`}
                  >
                      <AlertCircle size={20} className="shrink-0" />
                      <div>
                        {error}
                        {isUnverified && (
                          <div className="mt-2">
                             <a href="https://mail.google.com" target="_blank" rel="noreferrer" className="underline font-bold">Open Gmail</a>
                          </div>
                        )}
                      </div>
                  </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email */}
                  <motion.div variants={formItem}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <div className="relative">
                          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                          <input
                              {...register("email", { required: true })}
                              type="email"
                              placeholder="Email Address"
                              className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                          />
                      </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={formItem}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                      <div className="relative">
                          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                          <input
                              {...register("password", { required: true })}
                              type="password"
                              placeholder="••••••••"
                              className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                          />
                      </div>
                  </motion.div>

                  {/* Submit */}
                  <motion.button
                      variants={formItem}
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-lg mt-8 flex items-center justify-center
                          ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-indigo-400/50"}
                      `}
                  >
                      <LogIn size={20} className="mr-2" />
                      {loading ? "Verifying..." : "Login"}
                  </motion.button>
              </form>

              <motion.p className="mt-8 text-center text-sm text-gray-600" variants={formItem}>
                  Don't have an account?{" "}
                  <Link to="/register" className="text-indigo-600 font-semibold hover:underline transition">
                    Register Here
                  </Link>
              </motion.p>
          </div>
      </div>
    </motion.div>
  );
}

export default Login;