import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Search } from 'lucide-react';

const FAQData = [
    {
        question: "What is D-Hisaab?",
        answer: "D-Hisaab is a simple and secure accounting application designed to help you track your daily expenses, manage budgets, and maintain a digital ledger of your financial activities."
    },
    {
        question: "Is D-Hisaab free to use?",
        answer: "Yes, D-Hisaab is currently free to use for all personal users. We may introduce premium features in the future, but the core functionality will remain accessible."
    },
    {
        question: "How do I reset my password?",
        answer: "To reset your password, go to the Login page and click on 'Forgot Password'. Follow the instructions sent to your registered email address to create a new password."
    },
    {
        question: "Is my financial data secure?",
        answer: "Absolutely. We use industry-standard encryption and security measures to protect your data. We do not sell your personal financial information to third parties."
    },
    {
        question: "Can I download my expense reports?",
        answer: "Yes! You can download your monthly or yearly expense reports in PDF format directly from your dashboard. Look for the 'Download' button in the expense summary section."
    },
    {
        question: "How do I contact support?",
        answer: "You can reach out to our support team through the 'Contact Us' page or by emailing us directly at hisaab204@gmail.com. We typically respond within 24-48 hours."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                        <HelpCircle size={32} className="text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Everything you need to know about the product and billing. Can't find the answer you're looking for?
                    </p>
                </div>

                {/* Search Bar (Visual Only for now) */}
                {/* <div className="relative max-w-lg mx-auto mb-12">
          <input 
            type="text" 
            placeholder="Search for answers..." 
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div> */}

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {FAQData.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl overflow-hidden transition-all duration-300 border ${openIndex === index ? 'border-indigo-200 ring-2 ring-indigo-50 shadow-lg' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
                        >
                            <button
                                className="w-full px-6 py-5 text-left flex justify-between items-start focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className={`font-semibold text-lg ${openIndex === index ? 'text-indigo-700' : 'text-gray-900'}`}>
                                    {faq.question}
                                </span>
                                <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`}>
                                    {openIndex === index ? (
                                        <ChevronUp className="text-indigo-500" />
                                    ) : (
                                        <ChevronDown className="text-gray-400" />
                                    )}
                                </span>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full mb-4">
                        <MessageCircle size={24} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                    <p className="text-gray-500 mb-6">
                        Can’t find the answer you’re looking for? Please chat to our friendly team.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30"
                    >
                        Get in Touch
                    </a>
                </div>

            </div>
        </div>
    );
};

export default FAQ;
