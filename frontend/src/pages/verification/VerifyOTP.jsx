import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { verifyOTP } from '../../api/allApi';
import gmailImg from "../../assets/Gmail.png";

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();

    // 📝 location.state se email aur activationToken nikaalna
    const email = location.state?.email || "your@email.com";
    const activationToken = location.state?.activationToken;

    useEffect(() => {
        // Agar activationToken nahi hai, toh registration incomplete hai
        if (!activationToken) {
            navigate('/register');
        }
    }, [activationToken, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // 📝 Backend ko otp ke saath activationToken bhi bhej rahe hain
            const response = await verifyOTP({ 
                otp, 
                activationToken 
            });

            if (response.success) {
                alert("Account Created & Verified Successfully!");
                // Agar backend token bhej raha hai, toh use save karein
                if (response.data?.token) {
                    localStorage.setItem("token", response.data.token);
                }
                navigate('/'); // Dashboard/Home par bhejein
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or Expired OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
                
                {/* 1. Image Section - Top on Mobile */}
                <div className="flex justify-center md:order-1">
                    <motion.img
                        src={gmailImg}
                        alt="Email Verification"
                        className="w-[280px] md:w-[400px] mt-4"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* 2. Content Section */}
                <div className="md:order-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-600 mb-4">
                        Verify your email
                    </h1>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        We’ve sent a 6-digit verification code to your email address. 
                        Please enter the code below to activate your account.
                    </p>

                    <div className="mb-6 rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-indigo-700 font-medium inline-block">
                        {email}
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-6">
                        <input
                            type="text"
                            required
                            maxLength="6"
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-3xl tracking-[10px] md:tracking-[20px] font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        />

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-md ${
                                loading || otp.length !== 6 
                                ? 'bg-indigo-300 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                            }`}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Waiting for your input...
                        </div>
                        <p className="text-sm text-gray-500">
                            Didn't receive the code? <button className="text-indigo-600 font-bold hover:underline">Resend Code</button>
                        </p>
                        <button 
                            onClick={() => navigate("/register")}
                            className="text-sm text-gray-400 hover:text-indigo-600 text-left w-fit transition"
                        >
                            ← Back to Registration
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VerifyOTP;