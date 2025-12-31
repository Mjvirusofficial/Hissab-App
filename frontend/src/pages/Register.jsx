import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/allApi";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, Zap, CheckCircle } from "lucide-react"; 
import img1 from '../assets/img2.gif';

function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false); // Link bhejne ke baad status dikhane ke liye

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        /* =============================================================
           🔗 REDIRECTION LOGIC (UPDATED)
           Ab verify-otp ki jagah hum Loading/Success message dikhayenge
           ============================================================= */
        setIsSent(true); 
        // Aap chahein toh CheckEmailLoading page par bhi bhej sakte hain:
        // navigate("/check-email", { state: { email: data.email } });
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Agar link bhej diya gaya hai, toh ye UI dikhao
  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-green-100"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle size={50} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Sent!</h2>
          <p className="text-gray-600 mb-6">
            Humne ek verification link aapke email par bheja hai. Kripya apna inbox (aur Spam folder) check karein.
          </p>
          <button 
            onClick={() => window.location.href = "https://mail.google.com"}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Check Gmail
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-white">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <h3 className="text-3xl font-extrabold text-indigo-700 mb-6 uppercase">
            JOIN THE <br /> HISAB KITAB KI DUNIYA
          </h3>
          <div className="w-full h-[400px] overflow-hidden rounded-xl shadow-xl border-4 border-gray-50">
            <img src={img1} alt="Registration" className="w-full h-full object-contain" />
          </div>
          <p className="mt-6 text-gray-600 flex items-center justify-center font-medium">
            <Zap size={20} className="mr-2 text-indigo-600" />
            Verification link will be sent to your email.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Register Now</h1>
          <p className="text-gray-500 mb-8">Create your account to get started.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input {...register("name", { required: true })} placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input {...register("email", { required: true })} type="email"
                placeholder="example@gmail.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input {...register("password", { required: true })} type="password"
                placeholder="••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <button disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center
                ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}`}>
              <UserPlus size={20} className="mr-2" />
              {loading ? "Sending Link..." : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;