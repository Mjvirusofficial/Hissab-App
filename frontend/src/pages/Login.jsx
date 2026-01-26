import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import img1 from "../assets/loiniff.gif";
import { loginWithEmail, loginWithGoogle } from "../firebase/auth";

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      const user = await loginWithEmail(data.email, data.password);
      const token = await user.getIdToken();
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      // Dispatch auth change event for Navbar update
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const user = await loginWithGoogle();
      const token = await user.getIdToken();
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Dispatch auth change event for Navbar update
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center">
        <img src={img1} className="h-[400px]" />
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Login</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded"
            />

            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded"
            />

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            onClick={handleGoogle}
            className="w-full border py-3 rounded mt-4"
          >
            Login with Google
          </button>

          <p className="mt-4 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;




// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import { loginUser } from "../api/allApi";
// import { motion } from "framer-motion";
// import { Mail, Lock, LogIn, TrendingUp } from "lucide-react"; 
// import img1 from '../assets/loiniff.gif';

// // --- Animation Variants ---
// const mainContainer = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
// };

// const sectionItem = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0 },
// };

// const formItem = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// };

// function Login() {

//   const { register, handleSubmit } = useForm();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const onSubmit = async (data, e) => { // 'e' ko yahan add kiya
//     // 1. Browser refresh ko rokne ke liye
//     if (e) e.preventDefault(); 

//     try {
//         setLoading(true);
//         setError("");
        
//         const response = await loginUser({
//             email: data.email,
//             password: data.password
//         });

//         if (response.success) {
//             // 2. Token aur User data save karna (Aapki allApi.js waise ye handle karti hai, 
//             // par manually karna safe hai)
//             localStorage.setItem("token", response.data.token);
//             localStorage.setItem("user", JSON.stringify(response.data));

//             // 3. ⚡ SABSE ZAROORI: Navbar ko signal bhejna bina page refresh kiye
//             window.dispatchEvent(new Event("authChange"));

//             // 4. Dashboard par bhejna
//             navigate("/"); 
//         } else {
//             setError(response.message);
//         }
//     } catch (err) {
//         setError(err.response?.data?.message || "Login failed");
//     } finally {
//         setLoading(false);
//     }
// };
  
//   return (
//     <motion.div
//       className="min-h-screen flex flex-col md:flex-row w-full bg-white" 
//       variants={mainContainer}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* 1. Image Section */}
//       <motion.div
//         className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white md:h-screen" 
//         variants={sectionItem}
//       >
//         <div className="text-center max-w-lg">
//             <h3 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-6 uppercase">
//                 Welcome Back <br /> 
//                 Hisab Kitab Ki Duniya
//             </h3>
            
//             <motion.div 
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
//                 className="w-full h-[400px] sm:h-[500px] max-h-[60vh] overflow-hidden rounded-xl shadow-xl border-4 border-gray-100" 
//             >
//                 <img src={img1} alt="Login Animation" className="w-full h-full object-contain" />
//             </motion.div>
            
//             <p className="mt-6 text-base text-gray-600 flex items-center justify-center font-medium">
//                 <TrendingUp size={20} className="mr-2 text-indigo-600" />
//                 Your platform for seamless management.
//             </p>
//         </div>
//       </motion.div>

//       {/* 2. Form Section */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white">
//           <div className="w-full max-w-md">
//               <motion.h1 className="text-4xl font-bold text-gray-900 mb-2" variants={formItem}>Sign In</motion.h1>
//               <motion.p className="text-gray-500 mb-10 text-lg" variants={formItem}>Enter your details to access your account.</motion.p>

//               {error && (
//                   <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 text-sm font-medium border border-red-200"
//                   >
//                       {error}
//                   </motion.div>
//               )}

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                   {/* Email */}
//                   <motion.div variants={formItem}>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
//                       <div className="relative">
//                           <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
//                           <input
//                               {...register("email", { required: true })}
//                               type="email"
//                               placeholder="Email Address"
//                               className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition"
//                           />
//                       </div>
//                   </motion.div>

//                   {/* Password */}
//                   <motion.div variants={formItem}>
//                       <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
//                       <div className="relative">
//                           <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
//                           <input
//                               {...register("password", { required: true })}
//                               type="password"
//                               placeholder="••••••••"
//                               className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition"
//                           />
//                       </div>
//                   </motion.div>

//                   {/* Submit */}
//                   <motion.button
//                       variants={formItem}
//                       type="submit"
//                       disabled={loading}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-lg mt-8 flex items-center justify-center
//                           ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-indigo-400/50"}
//                       `}
//                   >
//                       <LogIn size={20} className="mr-2" />
//                       {loading ? "Verifying..." : "Login"}
//                   </motion.button>
//               </form>

//               <motion.p className="mt-8 text-center text-sm text-gray-600" variants={formItem}>
//                   Don't have an account?{" "}
//                   <Link to="/register" className="text-indigo-600 font-semibold hover:underline transition">
//                       Register Here
//                   </Link>
//               </motion.p>
//           </div>
//       </div>
//     </motion.div>
//   );
// }

// export default Login;