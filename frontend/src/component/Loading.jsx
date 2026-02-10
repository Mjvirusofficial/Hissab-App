import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div className="fixed inset-0 min-h-screen z-50 flex flex-col items-center justify-center bg-gray-50/90 backdrop-blur-md overflow-hidden">

            {/* Background Animated Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, -100, 0],
                        y: [0, -100, 100, 0],
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -150, 150, 0],
                        y: [0, 150, -150, 0],
                        scale: [1, 0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-[100px]"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center">

                {/* Logo Container with Ripple Effect */}
                <div className="relative mb-8">
                    {/* Ripples */}
                    {[1, 2, 3].map((index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: [0, 0.3, 0],
                                scale: [0.8, 1.5, 2]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: index * 0.4,
                                ease: "easeOut"
                            }}
                            className="absolute inset-0 bg-indigo-400/20 rounded-full z-0"
                        />
                    ))}

                    {/* Logo Box */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            duration: 1.5
                        }}
                        className="relative z-10 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 backdrop-blur-sm"
                    >
                        <motion.img
                            src="/hisaabLogo.png"
                            alt="D-Hisaab Logo"
                            className="w-20 h-20 object-contain"
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>
                </div>

                {/* Text Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col items-center gap-3"
                >
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        D-Hisaab
                    </h2>

                    <div className="flex items-center gap-1">
                        <span className="text-gray-500 font-medium text-sm tracking-widest uppercase">Loading</span>
                        <div className="flex gap-1 ml-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Progress Line (Optional, decorative) */}
            <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-100'>
                <motion.div
                    className='h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'
                    animate={{ width: ["0%", "100%"], x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

        </div>
    );
};

export default Loading;
