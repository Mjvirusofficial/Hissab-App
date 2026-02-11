import React from 'react';
import { FileCheck, Smartphone, AlertTriangle, Scale, Ban } from 'lucide-react';
import SEO from '../component/SEO';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Terms of Service"
                description="Read our Terms of Service to understand the rules and regulations for using D-Hisaab."
                url="https://dhisaab.netlify.app/terms"
            />
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header Section */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-12 text-white text-center">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <FileCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                        Terms of Service
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Please read these terms carefully before using our services.
                    </p>
                    <div className="mt-6 text-sm font-medium bg-white/10 inline-block px-4 py-1 rounded-full text-gray-200">
                        Effective Date: February 2026
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-8 py-10 space-y-10">

                    {/* Agreement to Terms */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-gray-100 p-2 rounded-lg mr-3 text-gray-700">
                                <Scale size={20} />
                            </span>
                            1. Agreement to Terms
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and <strong>D-Hisaab</strong> ("we," "us," or "our"), concerning your access to and use of the D-Hisaab website as well as any other media form, information, or application related, linked, or otherwise connected thereto. By accessing the Site, you confirm that you have read, understood, and agreed to be bound by all of these Terms of Service.
                        </p>
                    </section>

                    {/* User Representations */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600">
                                <Smartphone size={20} />
                            </span>
                            2. User Accounts
                        </h2>
                        <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                            <p className="text-gray-700 mb-3">
                                When you create an account with us, you must safeguard your password and use our service only for lawful purposes. You represent that:
                            </p>
                            <ul className="space-y-2">
                                {[
                                    "All registration information you submit will be true, accurate, current, and complete.",
                                    "You will maintain the accuracy of such information.",
                                    "You have the legal capacity and you agree to comply with these Terms of Service.",
                                    "You will not access the Site through automated or non-human means."
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start text-sm text-gray-600">
                                        <span className="mr-2 mt-1 text-blue-500">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Prohibited Activities */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-red-100 p-2 rounded-lg mr-3 text-red-600">
                                <Ban size={20} />
                            </span>
                            3. Prohibited Activities
                        </h2>
                        <p className="text-gray-600 mb-4">
                            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                        </p>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="bg-yellow-100 p-2 rounded-lg mr-3 text-yellow-600">
                                <AlertTriangle size={20} />
                            </span>
                            4. Limitation of Liability
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                        </p>
                    </section>

                    {/* Contact */}
                    <div className="border-t border-gray-200 pt-8 mt-8">
                        <p className="text-center text-gray-500 text-sm">
                            If you have any questions regarding these Terms, please contact us at <span className="text-indigo-600 font-semibold">hisaab204@gmail.com</span>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
