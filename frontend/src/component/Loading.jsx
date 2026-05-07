import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Loading = () => {
    return (
        <div className="fixed inset-0 min-h-screen z-[9999] flex flex-col items-center justify-center bg-[#fcfdfe] overflow-hidden font-sans">

            {/* --- PREMIUM DYNAMIC BACKGROUND --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 80, -80, 0],
                        y: [0, -60, 60, 0],
                        scale: [1, 1.2, 0.9, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 100, 0],
                        y: [0, 80, -80, 0],
                        scale: [1, 0.9, 1.1, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px]"
                />
            </div>

            {/* --- CENTRAL CONTENT --- */}
            <div className="relative z-10 flex flex-col items-center">

                {/* Logo Section */}
                <div className="relative mb-12">
                    {/* Soft Shadow Base */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-indigo-900/10 blur-xl rounded-full" />

                    {/* Main Logo Container (Squircle Shape) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                            y: [0, -10, 0]
                        }}
                        transition={{
                            opacity: { duration: 0.5 },
                            scale: { type: "spring", stiffness: 260, damping: 20 },
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="relative z-10 w-32 h-32 rounded-[2.5rem] shadow-[0_20px_40px_rgba(79,70,229,0.15)] overflow-hidden border border-white/80 flex items-center justify-center"
                    >
                        <div className="absolute inset-0 overflow-hidden bg-indigo-600">
                            <img
                                src="/Logo.jpeg"
                                alt="D-Hisaab Logo"
                                className="w-full h-full object-cover scale-[1.18]"
                            />
                        </div>

                        {/* Shimmer overlay */}
                        <motion.div
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                        />
                    </motion.div>

                    {/* Ripples */}
                    {[1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.8],
                                opacity: [0.3, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 1,
                                ease: "easeOut"
                            }}
                            className="absolute inset-0 border-2 border-indigo-200 rounded-[2.5rem] -z-10"
                        />
                    ))}
                </div>

                {/* Text Branding */}
                <div className="flex flex-col items-center gap-5">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            D-Hisaab
                        </h2>
                    </motion.div>

                    <div className="flex items-center gap-3 py-2 px-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm">
                        <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Loading</span>
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.4, 1, 0.4], y: [0, -3, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PROGRESS BAR --- */}
            <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <div className="fixed bottom-8 text-[10px] font-bold text-gray-400 tracking-[0.5em] uppercase opacity-60">
                Syncing your finances
            </div>

        </div>
    );
};

export default Loading;
