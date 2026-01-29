import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import img1 from "../assets/img2.gif";

// Firebase Imports
import { auth, googleProvider } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from "firebase/auth";

// API Import for Token Exchange
import { googleLogin } from "../api/allApi";

function Register() {
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
        setError(apiRes.message || "Registration failed on server.");
      }
    } catch (err) {
      console.error("Backend Error:", err);
      setError("Failed to connect to server. Please try again.");
    }
  };

  // Email/Password Signup
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      // 1. Create User in Firebase
      const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // 2. Send Verification Email
      await sendEmailVerification(userCred.user);

      // 3. Redirect to Check Email Page
      navigate('/check-email', { state: { email: data.email } });

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Email already registered. Please Login. verify your email if needed.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Email/Password signup is not enabled. Please use Google.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Signup
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleTokenExchange(token);
    } catch (err) {
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <motion.div className="min-h-screen flex flex-col md:flex-row w-full bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* IMAGE SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white md:h-screen">
        <div className="text-center max-w-lg w-full">
          <h3 className="text-2xl md:text-4xl font-extrabold text-indigo-700 mb-6 uppercase">Join the <br /> Hisab Kitab World</h3>
          <div className="w-full h-[300px] md:h-[500px] overflow-hidden rounded-xl shadow-xl border-4 border-gray-100">
            <img src={img1} className="w-full h-full object-contain" alt="reg-gif" />
          </div>
          <p className="mt-4 text-gray-600 flex justify-center items-center"><Zap size={18} className="mr-2 text-indigo-600" /> Quick and secure sign-up.</p>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Register Now</h1>
          <p className="text-gray-500 mb-8">Create your free account today.</p>

          {/* GOOGLE BUTTON (TOP PER) */}
          <button onClick={handleGoogle} type="button" className="w-full mb-6 py-3 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
            <span className="font-semibold">Continue with Google</span>
          </button>

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input {...register("email", { required: true })} type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-lg" />
            <input {...register("password", { required: true })} type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-lg" />
            <button disabled={loading} className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-indigo-600 to-blue-500">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="mt-6 text-center">Already have an account? <Link to="/login" className="text-indigo-600 font-semibold">Login Here</Link></p>
        </div>
      </div>
    </motion.div>
  );
}

export default Register;