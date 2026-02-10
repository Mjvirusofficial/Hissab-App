import React from 'react';
import { Link } from 'react-router-dom';
// 💡 Icons updated to include Instagram
import { Home, ListChecks, Mail, Users, Linkedin, Github, Twitter, Instagram, Heart } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const creatorName = "Deepak";

  return (
    // Outer Container: Responsive padding added
    <footer className="bg-gray-800 text-white mt-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top Section: Grid optimized for Mobile (2 columns) and Desktop (3 columns) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8 mb-8">

          {/* 1. Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-xl leading-none pt-0.5">₹</span>
              </div>
              <span className="text-2xl font-extrabold text-white">D-Hisaab</span>
            </Link>
            <p className="text-sm text-gray-400 mt-2">
              Simple. Secure. Smart Accounting.
            </p>

            {/* Social Icons (Slightly larger gap for mobile touch) */}
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

          {/* 3. Legal & Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
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

          {/* 4. Contact Info */}
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

        {/* Bottom Section */}
        <div className="text-center text-sm text-gray-500 pt-4 px-2">
          <p>
            &copy; {currentYear} D-Hisaab. All rights reserved.
          </p>
          <div className="mt-1 flex items-center justify-center flex-wrap">
            <span>Designed and Developed by</span>
            <span className="text-indigo-400 font-medium mx-1">{creatorName}</span>
            <span>with</span>
            <Heart size={14} className="text-red-500 mx-1 fill-current" />
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;