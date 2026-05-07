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
    const params = new URLSearchParams(window.location.search);
    const forceReset = params.get('reset') === 'true';
    
    const hasSelected = localStorage.getItem('user_currency');
    if (!hasSelected || forceReset) {
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
    // Remove the reset param if present
    const url = new URL(window.location);
    url.searchParams.delete('reset');
    window.history.replaceState({}, '', url);
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 30 }} 
          animate={{ scale: 1, y: 0 }} 
          className="bg-white max-w-sm w-full rounded-[2.5rem] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.2)] relative overflow-hidden border border-white/50"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* New Premium Logo Image */}
            <div className="relative mb-6">
                <div className="absolute -inset-4 bg-indigo-500/10 rounded-full blur-xl" />
                <div className="relative w-20 h-20 bg-white p-1 rounded-[1.5rem] shadow-xl overflow-hidden border border-gray-50 flex items-center justify-center">
                    <img 
                        src="/Logo.jpeg" 
                        alt="D-Hisaab" 
                        className="w-full h-full object-cover scale-[1.18]" 
                    />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold shadow-lg border-2 border-white text-sm">
                    {selected.currency}
                </div>
            </div>
            
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600 tracking-tight">D-Hisaab</h1>
            <p className="text-[10px] font-bold text-gray-400 mt-1 mb-8 tracking-[0.2em] uppercase">Simple • Secure • Smart</p>

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
