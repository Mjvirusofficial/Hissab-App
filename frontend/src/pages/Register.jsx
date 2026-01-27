
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { User, Mail, Lock, UserPlus, Zap } from "lucide-react";
// import img1 from "../assets/img2.gif";
// import { registerWithEmail, loginWithGoogle } from "../firebase/auth";

// // Animations (SAME)
// const mainContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };
// const sectionItem = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
// const formItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

// function Register() {
//   const { register, handleSubmit } = useForm();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       setError("");
//       await registerWithEmail(data.email, data.password);
//       navigate("/"); // success
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="min-h-screen flex flex-col md:flex-row w-full bg-white"
//       variants={mainContainer}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* IMAGE SECTION */}
//       <motion.div
//         className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white md:h-screen"
//         variants={sectionItem}
//       >
//         <div className="text-center max-w-lg w-full">
//           <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 mb-6 uppercase">
//             Join the <br /> Hisab Kitab World
//           </h3>

//           <div className="w-full h-[280px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-xl shadow-xl border-4 border-gray-100">
//             <img src={img1} className="w-full h-full object-contain" />
//           </div>

//           <p className="mt-4 text-sm sm:text-base text-gray-600 flex justify-center items-center">
//             <Zap size={18} className="mr-2 text-indigo-600" /> Quick and secure sign-up.
//           </p>
//         </div>
//       </motion.div>

//       {/* FORM SECTION */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
//         <div className="w-full max-w-md">
//           <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" variants={formItem}>
//             Register Now
//           </motion.h1>

//           <motion.p className="text-gray-500 mb-6 sm:mb-10 text-sm sm:text-lg" variants={formItem}>
//             Create your free account today.
//           </motion.p>

//           {/* GOOGLE BUTTON */}
//           <button
//             onClick={loginWithGoogle}
//             className="w-full mb-6 py-3 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
//           >
//             <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
//             <span className="font-semibold text-sm sm:text-base">Continue with Google</span>
//           </button>

//           {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             <div>
//               <label className="text-sm font-semibold">Full Name</label>
//               <input
//                 {...register("name")}
//                 className="w-full mt-1 px-4 py-3 border rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-semibold">Email</label>
//               <input
//                 {...register("email", { required: true })}
//                 type="email"
//                 className="w-full mt-1 px-4 py-3 border rounded-lg"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-semibold">Password</label>
//               <input
//                 {...register("password", { required: true })}
//                 type="password"
//                 className="w-full mt-1 px-4 py-3 border rounded-lg"
//               />
//             </div>

//             <button
//               disabled={loading}
//               className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-indigo-600 to-blue-500"
//             >
//               {loading ? "Registering..." : "Register"}
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm">
//             Already have an account?{" "}
//             <Link to="/login" className="text-indigo-600 font-semibold">
//               Login Here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default Register;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import img1 from "../assets/img2.gif";

// Firebase Imports
import { auth, googleProvider } from "../firebase/auth";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email/Password Signup
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      navigate("/"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Signup
  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div className="min-h-screen flex flex-col md:flex-row w-full bg-white" initial={{opacity:0}} animate={{opacity:1}}>
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