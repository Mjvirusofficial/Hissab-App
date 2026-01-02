import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, logoutUser, getCurrentUser } from "../api/allApi";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ListChecks, LogIn, UserPlus, LogOut, Menu, X, User } from "lucide-react"; 

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // URL change ko track karne ke liye

  // 1. Function jo data ko fresh load karega
  const updateUser = () => {
    const userData = getCurrentUser();
    // Agar data nested hai toh safely extract karein
    const finalUser = userData?.data ? userData.data : userData;
    setUser(finalUser);
  };

  // 2. Component load hone par aur URL change hone par data update karein
  useEffect(() => {
    updateUser();
  }, [location.pathname]); // Jab bhi page badlega (Login se Home), ye chalega

  // 3. Storage Event Listeners (Agar dusre tab mein login/logout ho toh)
  useEffect(() => {
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/login");
    setIsMenuOpen(false); 
  };

  // UI logic (Classes)
  const navLinkClass = "flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out";

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* isAuthenticated() ke bajaye hum check karenge ki user state mein data hai ya nahi */}
            {user ? (
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
                            {user.name} {/* Ab ye correctly user.name dikhayega */}
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

          {/* Mobile menu button logic same rahegi... */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu logic (isAuthenticated ki jagah user state use karein) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link to="/" className="flex items-center px-3 py-3 text-gray-700" onClick={() => setIsMenuOpen(false)}>
                    <Home size={18} className="mr-2 text-indigo-500" /> Home
                  </Link>
                  <div className="px-3 py-2 text-gray-700 border-t mt-1 pt-3">
                    Hello, <span className="font-bold text-indigo-600 uppercase">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center px-3 py-3 text-gray-700" onClick={() => setIsMenuOpen(false)}>
                  <LogIn size={18} className="mr-2 text-indigo-500" /> Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;