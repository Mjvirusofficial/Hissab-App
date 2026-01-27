import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import img1 from '../assets/loiniff.gif';

// Firebase Imports
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// API Import
import { googleLogin } from "../api/allApi";

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTokenExchange = async (token) => {
    try {
      const apiRes = await googleLogin(token);
      if (apiRes.success) {
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      } else {
        setError(apiRes.message || "Login failed on server.");
      }
    } catch (err) {
      console.error("Backend Error:", err);
      setError("Failed to connect to server.");
    }
  };

  // ================= GOOGLE LOGIN LOGIC =================
  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleTokenExchange(token);
    } catch (err) {
      console.error(err);
      setError("Google Login failed. Please try again.");
    }
  };

  // ================= EMAIL LOGIN LOGIC =================
  const onSubmit = async (data, e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const userCred = await signInWithEmailAndPassword(auth, data.email, data.password);
      const token = await userCred.user.getIdToken();
      await handleTokenExchange(token);
    } catch (err) {
      setError(err.code === "auth/invalid-credential"
        ? "Invalid email or password."
        : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen flex flex-col md:flex-row w-full bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* 1. Image Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-white md:h-screen">
        <div className="text-center max-w-lg">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 mb-6 uppercase">
            Welcome Back <br />
            Hisab Kitab Ki Duniya
          </h3>

          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] max-h-[60vh] overflow-hidden rounded-xl shadow-xl border-4 border-gray-100">
            <img src={img1} alt="Login Animation" className="w-full h-full object-contain" />
          </div>

          <p className="mt-6 text-sm sm:text-base text-gray-600 flex items-center justify-center font-medium">
            <TrendingUp size={20} className="mr-2 text-indigo-600" />
            Your platform for seamless management.
          </p>
        </div>
      </div>

      {/* 2. Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-sm md:text-lg text-gray-500 mb-8">Enter your details to access your account.</p>

          {/* ===== GOOGLE LOGIN BUTTON ===== */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base hover:bg-gray-50 transition mb-6 shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
            <span className="truncate">Login with Google</span>
          </button>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">OR WITH EMAIL</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition outline-none text-sm sm:text-base"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                {...register("password", { required: true })}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition outline-none text-sm sm:text-base"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-lg mt-4 flex items-center justify-center
                          ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-indigo-400/50"}
                      `}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline transition">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
