import React from 'react';
import { Shield, Lock, Eye, FileText, Server } from 'lucide-react';
import SEO from '../component/SEO';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Privacy Policy"
                description="Read our Privacy Policy to understand how D-Hisaab collects, uses, and protects your personal data."
                url="https://dhisaab.netlify.app/privacy"
            />
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-white text-center">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
                        Your privacy is our priority. We are committed to protecting your personal data and ensuring transparency.
                    </p>
                    <div className="mt-6 text-sm font-medium bg-white/10 inline-block px-4 py-1 rounded-full text-indigo-50">
                        Last Updated: February 2026
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-8 py-10 space-y-10">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-indigo-100 p-2 rounded-lg mr-3 text-indigo-600">
                                <FileText size={20} />
                            </span>
                            1. Introduction
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Welcome to <strong>D-Hisaab</strong>. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-green-100 p-2 rounded-lg mr-3 text-green-600">
                                <Eye size={20} />
                            </span>
                            2. Information We Collect
                        </h2>
                        <p className="text-gray-600 mb-4">
                            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                        </p>
                        <ul className="space-y-3 ml-4">
                            {[
                                "Personal Data: Name, email address, and phone number when you register.",
                                "Financial Data: Transaction details and budget information you input.",
                                "Derivative Data: Information our servers automatically collect when you access the Site, such as your IP address and browser type."
                            ].map((item, index) => (
                                <li key={index} className="flex items-start text-gray-600">
                                    <span className="mr-2 mt-1.5 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600">
                                <Server size={20} />
                            </span>
                            3. How We Use Your Information
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                "Create and manage your account.",
                                "Process your transactions and expenses.",
                                "Email you regarding your account or order.",
                                "Generate a personal profile about you to make future visits more personalized.",
                                "Compile anonymous statistical data and analysis for use internally."
                            ].map((item, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 text-sm font-medium">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Security of Your Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-red-100 p-2 rounded-lg mr-3 text-red-600">
                                <Lock size={20} />
                            </span>
                            4. Security of Your Information
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                        </p>
                    </section>

                    {/* Contact Us */}
                    <section className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                        <h2 className="text-xl font-bold text-indigo-900 mb-2">Have questions about your data?</h2>
                        <p className="text-indigo-700 mb-4">
                            If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
                        </p>
                        <a href="mailto:hisaab204@gmail.com" className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm">
                            Contact Privacy Team
                        </a>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
