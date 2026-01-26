import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/allApi";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, Zap } from "lucide-react"; 
import img1 from '../assets/img2.gif'; 


// Animation Variants
const mainContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } } };
const sectionItem = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const formItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });

      // ================= UPDATED REDIRECTION =================
      if (response.success) {
        // Hum ab 'activationToken' bhi state mein pass kar rahe hain
        // Kyunki backend ne ise user create karne ke liye zaroori bataya hai
        navigate("/verify-otp", { 
            state: { 
                email: data.email,
                activationToken: response.activationToken // 👈 Yeh sabse zaroori change hai
            } 
        });
      } 
      // ========================================================
      else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen flex flex-col md:flex-row w-full bg-white" variants={mainContainer} initial="hidden" animate="visible">
      {/* 1. Image Section */}
      <motion.div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white md:h-screen" variants={sectionItem}>
        <div className="text-center max-w-lg">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-6 uppercase">Join the <br /> Hisab Kitab World</h3>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full h-[400px] sm:h-[500px] overflow-hidden rounded-xl shadow-xl border-4 border-gray-100">
                <img src={img1} alt="Registration" className="w-full h-full object-contain" />
            </motion.div>
            <p className="mt-6 text-base text-gray-600 flex items-center justify-center"><Zap size={20} className="mr-2 text-indigo-600" /> Quick and secure sign-up.</p>
        </div>
      </motion.div>

      {/* 2. Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
              <motion.h1 className="text-4xl font-bold text-gray-900 mb-2" variants={formItem}>Register Now</motion.h1>
              <motion.p className="text-gray-500 mb-10 text-lg" variants={formItem}>Create your free account today.</motion.p>

              {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                      {error}
                  </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div variants={formItem}>
                      <label className="block text-sm font-semibold mb-1">Full Name</label>
                      <div className="relative">
                          <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                          <input {...register("name", { required: true })} type="text" className="w-full pl-10 pr-3 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Full Name" />
                      </div>
                  </motion.div>

                  <motion.div variants={formItem}>
                      <label className="block text-sm font-semibold mb-1">Email</label>
                      <div className="relative">
                          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                          <input {...register("email", { required: true })} type="email" className="w-full pl-10 pr-3 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Email Address" />
                      </div>
                  </motion.div>

                  <motion.div variants={formItem}>
                      <label className="block text-sm font-semibold mb-1">Password</label>
                      <div className="relative">
                          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                          <input {...register("password", { required: true })} type="password" className="w-full pl-10 pr-3 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
                      </div>
                  </motion.div>

                  <motion.button
                      variants={formItem} type="submit" disabled={loading}
                      className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center cursor-pointer ${loading ? "bg-indigo-400" : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:shadow-lg"}`}
                  >
                      <UserPlus size={20} className="mr-2" />
                      {loading ? "Registering..." : "Register"}
                  </motion.button>
              </form>

              <motion.p className="mt-8 text-center text-sm text-gray-600" variants={formItem}>
                  Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login Here</Link>
              </motion.p>
          </div>
      </div>
    </motion.div>
  );
} 

export default Register;