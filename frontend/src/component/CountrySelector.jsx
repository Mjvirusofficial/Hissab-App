import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const countries = [
  { code: 'IN', name: 'India', currency: '₹', symbol: 'INR' },
  { code: 'US', name: 'United States', currency: '$', symbol: 'USD' },
  { code: 'UK', name: 'United Kingdom', currency: '£', symbol: 'GBP' },
  { code: 'EU', name: 'Europe', currency: '€', symbol: 'EUR' },
  { code: 'AE', name: 'UAE', currency: 'د.إ', symbol: 'AED' },
  { code: 'PK', name: 'Pakistan', currency: 'Rs', symbol: 'PKR' },
  { code: 'BD', name: 'Bangladesh', currency: '৳', symbol: 'BDT' },
  { code: 'NP', name: 'Nepal', currency: 'रु', symbol: 'NPR' },
];

function CountrySelector({ onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(countries[0]);

  useEffect(() => {
    const hasSelected = localStorage.getItem('user_currency');
    if (!hasSelected) {
      setIsOpen(true);
    } else {
      if (onComplete) onComplete();
    }
  }, [onComplete]);

  const handleSave = () => {
    localStorage.setItem('user_country', selected.name);
    localStorage.setItem('user_currency', selected.currency);
    setIsOpen(false);
    if (onComplete) onComplete();
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} 
          animate={{ scale: 1, y: 0 }} 
          className="bg-white max-w-sm w-full rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-100 mb-4 transition-all duration-300">
              {selected.currency}
            </div>
            
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600 tracking-tight">D-Hisaab</h1>
            <p className="text-xs font-semibold text-gray-500 mt-1 mb-8 tracking-wide">Simple, Secure, Smart Accounting :)</p>

            <h2 className="text-lg font-bold text-gray-800 mb-2">Welcome! Where are you from?</h2>
            <p className="text-xs text-gray-500 mb-6">Select your region to set your default currency.</p>

            <div className="w-full space-y-3 mb-8 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelected(country)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${selected.code === country.code ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-100 hover:border-indigo-200'}`}
                >
                  <span className="font-semibold text-gray-700">{country.name}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${selected.code === country.code ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {country.currency}
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={handleSave}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all"
            >
              Get Started →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CountrySelector;
