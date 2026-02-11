import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart, Instagram } from 'lucide-react';
import DR from '../assets/DR.png';
import SEO from '../component/SEO';

const About = () => {
    const [language, setLanguage] = useState('hinglish');

    const content = {
        english: {
            label: "About The Creator",
            greeting: "Hello, I'm Deepak! 👋",
            intro: "I am a passionate developer who always tries to turn new ideas into code.",
            ideaTitle: "How did the idea of Hissab-App come?",
            ideaText: "When my house was being built, at that time all the expenses had to be tracked by writing in a copy which I found very boring, so I used to write in phone notes. That's where the idea came from - why not create an app where we can directly write the expense name and amount, and it will calculate and display everything nicely. That's how this idea came and I developed it. And now I'm getting another idea after I heard about N8N AI agent, so the next web app is coming soon ❤️.",
            philosophy: "That's why I thought, why not create a simple and easy-to-use app that keeps accounts straight without any complex features. That's how D-Hisaab started! 🚀",
            footer: "Made with love for better financial habits."
        },
        hindi: {
            label: "रचनाकार के बारे में",
            greeting: "नमस्ते, मैं दीपक हूँ! 👋",
            intro: "मैं एक उत्साही डेवलपर हूँ जो हमेशा नए विचारों को कोड में बदलने की कोशिश करता है।",
            ideaTitle: "हिसाब-ऐप का विचार कैसे आया?",
            ideaText: "जब मेरा घर बन रहा था तो उस समय सभी खर्चों को कॉपी पर लिखकर ट्रैक करना पड़ता था जो मुझे बहुत ज्यादा उबाऊ लगता था इसलिए मैं फोन के नोट्स में लिखता था। तो विचार वहीं से आया कि क्यों ना एक ऐप ही बनाया जाए जिसमें सीधे हमको खर्च का नाम और राशि लिख दें, बाकी वो खुद से कैलकुलेट करके अच्छे से दिखाए। तो वहीं से यह विचार आया और विकसित कर दिया। और अब मुझे एक और विचार आ रहा है जब मैंने N8N AI एजेंट के बारे में सुना तो अगला वेब ऐप जल्द आ रहा है ❤️।",
            philosophy: "इसलिए मैंने सोचा क्यों ना एक सरल और उपयोग में आसान ऐप बनाया जाए जो बिना किसी जटिल सुविधाओं के, सीधा हिसाब रखे। बस यही सोचकर डी-हिसाब की शुरुआत हुई! 🚀",
            footer: "बेहतर वित्तीय आदतों के लिए प्यार से बनाया गया।"
        },
        hinglish: {
            label: "About The Creator",
            greeting: "Hello, I'm Deepak! 👋",
            intro: "Main ek passionate developer hu jo hamesha naye ideas ko code mein badalne ki koshish karta hai.",
            ideaTitle: "Hissab-App ka idea kaise aaya?",
            ideaText: "Jb mera ghar ban rha to us time pe sabhi expenses ko track krna padta tha copy pe likh k jo ki mujhy bahut jaada boring lgta tha isiliye main phone ke notes pe likhta tha to idea whi se aaya ki q naa ek app hi bnaya jaye jisme direct hmko karch ka naam and ammount likh de baaki wo khud se calculate kr ke ache se dikhaye. To whi se ye idea aaya and develop kr diya and now mujhy ek or idea aa rha h jb mainy N8N AI agent ke bre me suna to next web app is coming soon❤️.",
            philosophy: "Isliye maine socha kyun na ek simple aur easy-to-use app banaya jaye jo bina kisi complex features ke, seedha hisaab rakhe. Bas yahi soch kar D-Hisaab ki shuruwat hui! 🚀",
            footer: "Made with love for better financial habits."
        }
    };

    const currentContent = content[language];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="About Us"
                description="Learn about the mission and team behind D-Hisaab, the smart expense tracking app designed to simplify your financial life."
                url="https://dhisaab.netlify.app/about"
            />
            <div className="max-w-4xl mx-auto">
                {/* Language Toggle */}
                <div className="flex justify-end mb-8">
                    <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
                        {['english', 'hindi', 'hinglish'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${language === lang
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    key={language}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="md:flex">
                        {/* Left Side - Photo */}
                        <div className="md:w-1/2 relative h-64 md:h-auto bg-indigo-600 flex items-center justify-center">
                            <img
                                src={DR}
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
                            <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold mb-2">
                                {currentContent.label}
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                                {currentContent.greeting}
                            </h1>

                            <div className="prose prose-indigo text-gray-600 mb-6">
                                <p className="mb-4">
                                    {currentContent.intro}
                                </p>
                                <p className="mb-4">
                                    <strong>{currentContent.ideaTitle}</strong> <br />
                                    {currentContent.ideaText}
                                </p>
                                <p>
                                    {currentContent.philosophy}
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
                                <span>{currentContent.footer}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
