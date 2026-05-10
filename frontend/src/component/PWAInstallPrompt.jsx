import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Star } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show after 5 seconds
    const timer = setTimeout(() => {
      const alreadyDismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!alreadyDismissed) {
        setIsVisible(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Please use Chrome on Android/Desktop to install this app directly.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-xl border border-indigo-100 rounded-3xl shadow-2xl overflow-hidden p-6 flex flex-col gap-5 ring-1 ring-black/5">
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex items-center gap-5">
              <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shrink-0 overflow-hidden shadow-xl shadow-indigo-100 border border-gray-100">
                <motion.img 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  src="/Logo.png" 
                  alt="Logo" 
                  className="w-[85%] h-[85%] object-contain rounded-lg" 
                />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-lg leading-tight">
                  Hissab-App: Smart Expense Tracking 🚀
                </h3>
                <p className="text-indigo-600 text-sm font-semibold mt-1">Behtar experience ke liye app install karein!</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✅</span>
                <p className="text-gray-600 text-sm">
                  <span className="font-bold text-gray-800">Offline Access:</span> Bina internet ke bhi entry karein.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✅</span>
                <p className="text-gray-600 text-sm">
                  <span className="font-bold text-gray-800">Fast & Light:</span> Ekdum smooth interface.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-200"
              >
                <Download className="w-5 h-5" />
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-6 py-3.5 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
