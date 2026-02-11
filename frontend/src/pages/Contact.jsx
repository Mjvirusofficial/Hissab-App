import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, User, Phone } from 'lucide-react';
import SEO from '../component/SEO';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, message } = formData;
        const phoneNumber = "917061335711";

        // Construct WhatsApp URL
        const text = encodeURIComponent(`Name: ${name}\nMessage: ${message}`);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${text}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Contact Us"
                description="Get in touch with the D-Hisaab team for support, feedback, or inquiries."
                url="https://dhisaab.netlify.app/contact"
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl"
            >
                <div className="md:flex">
                    <div className="p-8 w-full">
                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Get in Touch</div>
                        <h1 className="block mt-1 text-lg leading-tight font-medium text-black">Contact Us</h1>
                        <p className="mt-2 text-gray-500">
                            Fill out the form below to send a message directly to our WhatsApp.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-6">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                    Message
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                        <MessageSquare className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500 h-32"
                                        id="message"
                                        name="message"
                                        placeholder="Type your message here..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center transition duration-150 ease-in-out w-full justify-center"
                                    type="submit"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send to WhatsApp
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;
