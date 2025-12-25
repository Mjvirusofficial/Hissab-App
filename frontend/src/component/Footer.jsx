import React from 'react';
import { Link } from 'react-router-dom';
// 💡 Icons updated to include Instagram
import { Home, ListChecks, Mail, Users, Linkedin, Github, Twitter, Instagram, Heart } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const creatorName = "Deepak"; // 💡 आपका नाम यहाँ Define किया गया

  return (
    // Outer Container: Dark background, light text, slight padding
    <footer className="bg-gray-800 text-white mt-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Section: Logo, Tagline, and Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">
          
          {/* 1. Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-3">
              {/* Logo: Indian Rupee Symbol (₹) */}
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-xl leading-none pt-0.5">₹</span> 
              </div>
              <span className="text-2xl font-extrabold text-white">Hisaab</span>
            </Link>
            <p className="text-sm text-gray-400 mt-2">
              Simple. Secure. Smart Accounting.
            </p>
            
            {/* 💡 Social Icons (Instagram Added) */}
            <div className="flex space-x-4 mt-4">
              <a href="#" target="_blank" aria-label="LinkedIn" className="text-gray-400 hover:text-indigo-400 transition">
                <Linkedin size={20} />
              </a>
              <a href="#" target="_blank" aria-label="GitHub" className="text-gray-400 hover:text-indigo-400 transition">
                <Github size={20} />
              </a>
              <a href="#" target="_blank" aria-label="Twitter" className="text-gray-400 hover:text-indigo-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#" target="_blank" aria-label="Instagram" className="text-gray-400 hover:text-indigo-400 transition">
                <Instagram size={20} /> {/* 💡 New Instagram Icon */}
              </a>
            </div>
          </div>
          
          {/* 2. Quick Links (Navigation) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white flex items-center transition">
                  <Home size={16} className="mr-2" /> Home
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="text-gray-400 hover:text-white flex items-center transition">
                  <ListChecks size={16} className="mr-2" /> All Expenses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white flex items-center transition">
                  <Users size={16} className="mr-2" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white flex items-center transition">
                  <Mail size={16} className="mr-2" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Legal & Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 4. Contact Info (Placeholder) */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
            <p className="text-gray-400 text-sm">
                Need support or have a partnership inquiry?
            </p>
            <p className="text-white font-medium mt-2">
                support@hisaabkitab.com
            </p>
          </div>
          
        </div>

        {/* Bottom Section: Copyright (Personalized for Deepak) */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>
            &copy; {currentYear} Hisaab. All rights reserved. 
          </p>
          {/* 💡 Creator's Name Added */}
          <p className="mt-1 flex items-center justify-center">
            Designed and Developed by <span className="text-indigo-400 font-medium mx-1">{creatorName}</span> with <Heart size={14} className="text-red-500 mx-1" />.
          </p>
        </div>
        
      </div>
    </footer>
  );
}

export default Footer;