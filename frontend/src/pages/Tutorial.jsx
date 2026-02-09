import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Wallet, Edit3, Download, Globe, CheckCircle } from 'lucide-react';

const Tutorial = () => {
    const [language, setLanguage] = useState('hinglish');

    const content = {
        english: {
            title: "How D-Hisaab Works",
            subtitle: "A simple guide to managing your expenses.",
            intro: "D-Hisaab is a simple web app designed to track your daily and trip expenses. There are 2 easy ways to use it.",
            sections: [
                {
                    id: 1,
                    title: "1️⃣ With Budget (For Trips/Events)",
                    icon: <Wallet className="w-6 h-6 text-green-500" />,
                    desc: "Use this when you are going on a trip or have a fixed amount for a task.",
                    steps: [
                        "First, enter the trip or expense name (e.g., Bhopal Trip).",
                        "Then set your total budget (e.g., ₹5000).",
                        "Now, whenever you spend money, add an entry (ticket, hotel, food, etc.)."
                    ],
                    benefit: " The app automatically calculates how much money is left and warns you if you exceed your budget."
                },
                {
                    id: 2,
                    title: "2️⃣ Without Amount (Daily Expenses)",
                    icon: <Edit3 className="w-6 h-6 text-blue-500" />,
                    desc: "Use this for small daily expenses where you don't need to track the exact budget limit.",
                    steps: [
                        "Just add the name of the item (e.g., Vegetables, Momos, Chocolate).",
                        "Entering the amount is optional.",
                        "The app saves all entries by date."
                    ],
                    benefit: "Helps you remember where your money went and gives you an idea of daily spending."
                },
                {
                    id: 3,
                    title: "📄 PDF Download Option",
                    icon: <Download className="w-6 h-6 text-red-500" />,
                    desc: "When you need your full expense report:",
                    steps: [
                        "Click the 'Download PDF' button.",
                        "The app generates a clean PDF of all your expenses."
                    ],
                    benefit: "You can save, share, or keep it for future reference."
                }
            ],
            whoFor: {
                title: "✅ Who is D-Hisaab for?",
                list: ["Students", "People going on trips", "Daily expense trackers", "Those who forget where their money went 😄"]
            }
        },
        hindi: {
            title: "D-Hisaab कैसे काम करता है",
            subtitle: "आपके खर्चों को प्रबंधित करने के लिए एक सरल गाइड।",
            intro: "D-Hisaab एक साधारण वेब ऐप है जिसका काम सिर्फ इतना है — आपके दैनिक और यात्रा के खर्चों का हिसाब रखना। इसमें काम करने के 2 आसान तरीके हैं।",
            sections: [
                {
                    id: 1,
                    title: "1️⃣ With Budget (बजट के साथ)",
                    icon: <Wallet className="w-6 h-6 text-green-500" />,
                    desc: "जब आप कहीं ट्रिप पर जा रहे हो या किसी काम के लिए फिक्स्ड पैसे रखते हो, तब यह विकल्प चुनें।",
                    steps: [
                        "सबसे पहले आप ट्रिप या खर्च का नाम लिखते हो (जैसे: भोपाल ट्रिप)।",
                        "फिर आप कुल बजट सेट करते हो (जैसे: ₹5000)।",
                        "अब जब-जब पैसे खर्च होते हैं, आप एंट्री ऐड कर देते हो (टिकट, होटल, खाना, आदि)।"
                    ],
                    benefit: "ऐप अपने आप बताता है कितना पैसा बचा है और बजट क्रॉस होने पर अलर्ट भी करता है।"
                },
                {
                    id: 2,
                    title: "2️⃣ Without Amount (सामान्य दैनिक खर्च)",
                    icon: <Edit3 className="w-6 h-6 text-blue-500" />,
                    desc: "जब आप रोज़ के छोटे-मोटे खर्च लिखना चाहते हो और सटीक बजट की ज़रूरत नहीं है।",
                    steps: [
                        "आप सिर्फ चीज़ का नाम ऐड करते हो (जैसे: सब्ज़ी, मोमोज़, चॉकलेट)।",
                        "राशि डालना ज़रूरी नहीं होता।",
                        "ऐप सभी एंट्रीज़ को तारीख के हिसाब से सेव करता है।"
                    ],
                    benefit: "आपको याद रहता है पैसे किस-किस चीज़ पर गए और डेली खर्च का आईडिया मिलता रहता है।"
                },
                {
                    id: 3,
                    title: "📄 PDF डाउनलोड का विकल्प",
                    icon: <Download className="w-6 h-6 text-red-500" />,
                    desc: "जब आपको अपना पूरा हिसाब चाहिए होता है:",
                    steps: [
                        "बस 'Download PDF' बटन पर क्लिक करो।",
                        "ऐप आपके सारे खर्चों का एक साफ़ PDF बना देता है।"
                    ],
                    benefit: "इस PDF को आप सेव कर सकते हो, शेयर कर सकते हो या फ्यूचर के लिए रख सकते हो।"
                }
            ],
            whoFor: {
                title: "✅ D-Hisaab किसके लिए उपयोगी है?",
                list: ["छात्र (Students)", "ट्रिप पर जाने वाले लोग", "रोज़ का खर्च ट्रैक करने वाले", "जो पैसे का हिसाब भूल जाते हैं 😄"]
            }
        },
        hinglish: {
            title: "D-Hisaab kaise kaam karta hai",
            subtitle: "(Easy Explanation)",
            intro: "D-Hisaab ek simple web app hai jiska kaam sirf itna hai — aapke daily aur trip ke kharchon ka hisaab rakhna. Isme kaam karne ke 2 easy tareeke hote hain.",
            sections: [
                {
                    id: 1,
                    title: "1️⃣ With Budget (Budget ke saath hisaab)",
                    icon: <Wallet className="w-6 h-6 text-green-500" />,
                    desc: "Jab aap kahin trip par ja rahe ho ya kisi kaam ke liye fixed paise rakhte ho, tab With Budget option use hota hai.",
                    steps: [
                        "Sabse pehle aap trip ya expense ka naam likhte ho (jaise: Bhopal Trip).",
                        "Phir aap total budget set karte ho (jaise: ₹5000).",
                        "Ab jab-jab paise kharch hote hain, aap entry add kar dete ho (ticket, hotel, khana, etc.)."
                    ],
                    benefit: "App automatically batata hai kitna paisa bachaa hai aur ye bhi dikhata hai ki budget cross hua hai ya nahi."
                },
                {
                    id: 2,
                    title: "2️⃣ Without Amount (Normal daily kharch)",
                    icon: <Edit3 className="w-6 h-6 text-blue-500" />,
                    desc: "Jab aap roz ke chhote-mote kharch likhna chahte ho aur exact amount yaad nahi rehta, tab Without Amount option use hota hai.",
                    steps: [
                        "Aap sirf cheez ka naam add karte ho (jaise: sabzi, momos, chocolate).",
                        "Amount daalna zaroori nahi hota.",
                        "App sabhi entries ko date ke hisaab se save karta hai."
                    ],
                    benefit: "Aapko yaad rehta hai paise kis-kis cheez par gaye. Daily spending ka idea milta rehta hai."
                },
                {
                    id: 3,
                    title: "📄 PDF Download ka option",
                    icon: <Download className="w-6 h-6 text-red-500" />,
                    desc: "Jab aapko apna poora hisaab chahiye hota hai:",
                    steps: [
                        "Bas Download PDF button par click karo.",
                        "App aapke saare expenses ka ek clean PDF bana deta hai."
                    ],
                    benefit: "Is PDF ko aap save kar sakte ho, share kar sakte ho, ya future ke liye rakh sakte ho."
                }
            ],
            whoFor: {
                title: "✅ D-Hisaab kis ke liye useful hai?",
                list: ["Students", "Trip par jaane wale log", "Daily kharch track karne wale", "Jo paise ka hisaab bhool jaate hain 😄"]
            }
        }
    };

    const currentContent = content[language];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

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
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{currentContent.title}</h1>
                        <p className="text-xl text-indigo-600 font-medium">{currentContent.subtitle}</p>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">{currentContent.intro}</p>
                    </div>

                    <div className="space-y-8">
                        {currentContent.sections.map((section) => (
                            <motion.div
                                key={section.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                                whileHover={{ y: -5 }}
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-indigo-50 rounded-lg mr-4">
                                            {section.icon}
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                                    </div>

                                    <p className="text-gray-600 mb-6 italic border-l-4 border-indigo-200 pl-4">
                                        {section.desc}
                                    </p>

                                    <div className="bg-gray-50 rounded-lg p-5 mb-4">
                                        <h3 className="font-bold text-gray-700 mb-3 uppercase text-xs tracking-wider">How it works</h3>
                                        <ul className="space-y-3">
                                            {section.steps.map((step, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <CheckCircle className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-center text-sm font-medium text-indigo-700 bg-indigo-50 p-3 rounded-md">
                                        <span className="mr-2">💡</span>
                                        {section.benefit}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-xl p-8 text-white relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                {currentContent.whoFor.title}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {currentContent.whoFor.list.map((item, idx) => (
                                    <div key={idx} className="flex items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};

export default Tutorial;
