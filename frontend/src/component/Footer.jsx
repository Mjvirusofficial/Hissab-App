import React from 'react';
import { Link } from 'react-router-dom';
import AdBanner from './AdBanner';
import { Home, ListChecks, Mail, Users, Linkedin, Github, Instagram, Heart } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const creatorName = "Deepak";

  return (
    <footer className="bg-gray-800 text-white mt-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8 mb-8">

          {/* 1. Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-3 group">
              
              {/* LOGO BOX */}
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-[10px] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                
                {/* ❌ OLD TEXT LOGO (COMMENTED) */}
                {/* <span className="text-white font-black text-2xl italic drop-shadow-sm leading-none pl-0.5">D</span> */}

                {/* ✅ NEW IMAGE LOGO */}
                <img
                  src="/D-Logo.png"
                  alt="logo"
                  className="w-6 h-6 object-contain"
                />
              </div>

              <span className="text-2xl font-extrabold text-white">Hisaab</span>
            </Link>

            <p className="text-sm text-gray-400 mt-2">
              Simple. Secure. Smart Accounting.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              <a href="https://www.linkedin.com/in/deepak-ravidas-65956a388/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/Mjvirusofficial/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition">
                <Github size={20} />
              </a>
              <a href="https://www.instagram.com/0ye_its_deepak/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white flex items-center transition text-sm">
                  <Home size={16} className="mr-2" /> Home
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="text-gray-400 hover:text-white flex items-center transition text-sm">
                  <ListChecks size={16} className="mr-2" /> All Expenses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white flex items-center transition text-sm">
                  <Users size={16} className="mr-2" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white flex items-center transition text-sm">
                  <Mail size={16} className="mr-2" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition text-sm flex items-center">
                  Blog & Tips <span className="ml-2 text-[10px] bg-indigo-600 text-white px-1.5 rounded">New</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
            <p className="text-gray-400 text-sm">
              Need support or have a partnership inquiry?
            </p>
            <p className="text-white font-medium mt-2 break-all text-sm">
              hisaab204@gmail.com
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="text-center text-sm text-gray-500 pt-4 px-2 mb-10">
          <p>&copy; {currentYear} D-Hisaab. All rights reserved.</p>
          <div className="mt-1 flex items-center justify-center flex-wrap">
            <span>Designed and Developed by</span>
            <span className="text-indigo-400 font-medium mx-1">{creatorName}</span>
            <span>with</span>
            <Heart size={14} className="text-red-500 mx-1 fill-current" />
          </div>
        </div>

        {/* Ad */}
        <AdBanner
          adKey="f8458e013e16aa03cfc068939f35a723"
          width={320}
          height={50}
        />

      </div>
    </footer>
  );
}

export default Footer;
