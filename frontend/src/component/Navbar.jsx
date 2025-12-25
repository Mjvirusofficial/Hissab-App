import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser, getCurrentUser } from "../api/allApi";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ListChecks, LogIn, UserPlus, LogOut, Menu, X, User } from "lucide-react"; 

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Component load hone par user data nikaalne ke liye
  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
    setIsMenuOpen(false); 
  };
  
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
        opacity: 1, 
        height: "auto", 
        transition: { duration: 0.3, ease: "easeInOut" } 
    },
    exit: { 
        opacity: 0, 
        height: 0, 
        transition: { duration: 0.3, ease: "easeInOut" } 
    }
  };

  const navLinkClass = "flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out";
  const mobileLinkClass = "flex items-center px-3 py-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition duration-150 ease-in-out";

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* 1. Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:bg-indigo-700 transition">
                    <span className="text-white font-extrabold text-xl leading-none pt-0.5">₹</span> 
                </div>
                <span className="text-xl font-extrabold text-gray-800 group-hover:text-indigo-600 transition">
                    Hisaab
                </span>
            </Link>
          </div>

          {/* 2. Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated() ? (
              <>
                <Link to="/" className={navLinkClass}>
                    <Home size={18} className="mr-1.5" /> Home
                </Link>
                <Link to="/expenses" className={navLinkClass}>
                    <ListChecks size={18} className="mr-1.5" /> All Expenses
                </Link>
                
                <div className="flex items-center space-x-4 ml-4">
                    <div className="text-sm text-gray-600 flex items-center">
                        <User size={18} className="mr-1 text-indigo-500" /> 
                        Hello, <span className="font-bold ml-1 text-indigo-700 uppercase">
                            {user?.name || "GUEST"}
                        </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition shadow-md hover:shadow-lg"
                    >
                      <LogOut size={16} className="mr-1.5" />
                      Logout
                    </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass}>
                    <LogIn size={18} className="mr-1.5" /> Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md shadow-indigo-300/50 hover:shadow-lg"
                >
                    <UserPlus size={18} className="mr-1.5" /> 
                    Register
                </Link>
              </>
            )}
          </div>

          {/* 3. Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white border-t border-gray-100"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated() ? (
                <>
                  <Link 
                    to="/" 
                    className={mobileLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={18} className="mr-2 text-indigo-500" /> Home
                  </Link>
                  <Link 
                    to="/expenses" 
                    className={mobileLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ListChecks size={18} className="mr-2 text-indigo-500" /> All Expenses
                  </Link>
                  
                  <div className="px-3 py-2 text-gray-700 border-t mt-1 pt-3">
                    <span className="flex items-center">
                        <User size={18} className="mr-2 text-gray-500" />
                        Logged in as: <span className="font-bold ml-1 text-indigo-600 uppercase">
                            {user?.name || "GUEST"}
                        </span>
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
                  >
                    <span className="flex items-center">
                        <LogOut size={18} className="mr-2" />
                        Logout
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={mobileLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={18} className="mr-2 text-indigo-500" /> Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center justify-center">
                        <UserPlus size={18} className="mr-2" /> Register
                    </span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;