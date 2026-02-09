import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart, Instagram } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="md:flex">
                    {/* Left Side - Photo */}
                    <div className="md:w-1/2 relative h-64 md:h-auto bg-indigo-600 flex items-center justify-center">
                        {/* Placeholder for user photo - Replace src with actual image content or URL */}
                        {/* Using a generic high-quality avatar from Unsplash as placeholder or a solid color with initials */}
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                            alt="Creator"
                            className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                            <h2 className="text-2xl font-bold">Deepak Ravidas</h2>
                            <p className="text-indigo-200">Full Stack Developer</p>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold mb-2">About The Creator</div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Hello, I'm Deepak! 👋</h1>

                        <div className="prose prose-indigo text-gray-600 mb-6">
                            <p className="mb-4">
                                Main ek passionate developer hu jo hamesha naye ideas ko code mein badalne ki koshish karta hai.
                            </p>
                            <p className="mb-4">
                                <strong>Hissab-App ka idea kaise aaya?</strong> <br />
                                Maine dekha ki students aur bachelors ko apne daily kharche manage karne mein kaafi dikkat hoti hai. Kabhi budget out ho jata hai, toh kabhi hisaab kho jata hai.
                            </p>
                            <p>
                                Isliye maine socha kyun na ek <strong>simple</strong> aur <strong>easy-to-use</strong> app banaya jaye jo bina kisi complex features ke, seedha hisaab rakhe. Bas yahi soch kar D-Hisaab ki shuruwat hui! 🚀
                            </p>
                        </div>

                        <div className="flex space-x-4 mt-4">
                            <a href="https://github.com/Mjvirusofficial/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition">
                                <Github className="w-6 h-6" />
                            </a>
                            <a href="https://www.instagram.com/0ye_its_deepak/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full text-pink-500 hover:bg-pink-600 hover:text-white transition">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://www.linkedin.com/in/deepak-ravidas-65956a388/" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full text-blue-700 hover:bg-blue-800 hover:text-white transition">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 flex items-center text-sm text-gray-500">
                            <Heart className="w-4 h-4 text-red-500 mr-2 filled" />
                            <span>Made with love for better financial habits.</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
