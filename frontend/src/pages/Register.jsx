import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/allApi";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, Zap } from "lucide-react"; 
import img1 from '../assets/img2.gif';

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
        password: data.password,
      });

      if (response.success) {
        // 🔥 Direct login ke liye token save
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        // ✅ Direct dashboard / home par bhejo
        navigate("/");
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-white">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <h3 className="text-3xl font-extrabold text-indigo-700 mb-6">
            JOIN THE <br /> HISAB KITAB KI DUNIYA
          </h3>
          <div className="w-full h-[400px] overflow-hidden rounded-xl shadow-xl">
            <img src={img1} alt="Registration" className="w-full h-full object-contain" />
          </div>
          <p className="mt-6 text-gray-600 flex items-center justify-center">
            <Zap size={20} className="mr-2 text-indigo-600" />
            Quick and secure sign-up.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2">Register Now</h1>
          <p className="text-gray-500 mb-8">Create your free account today.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input {...register("name", { required: true })} placeholder="Full Name"
              className="w-full p-3 border rounded" />

            <input {...register("email", { required: true })} type="email"
              placeholder="Email" className="w-full p-3 border rounded" />

            <input {...register("password", { required: true })} type="password"
              placeholder="Password" className="w-full p-3 border rounded" />

            <button disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
