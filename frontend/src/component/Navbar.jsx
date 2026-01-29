import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ListChecks, LogIn, UserPlus, LogOut, Menu, X, User } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "User",
          email: currentUser.email,
          uid: currentUser.uid,
        });
      } else {
        setUser(null);
      }
    });

    const handleAuthChange = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "User",
          email: currentUser.email,
          uid: currentUser.uid,
        });
      }
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      unsubscribe();
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/login");
    setIsMenuOpen(false);
  };

  const navLinkClass =
    "flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out";

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
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

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/" className={navLinkClass}><Home size={18} className="mr-1.5" /> Home</Link>
                <Link to="/profile" className={navLinkClass}><User size={18} className="mr-1.5" /> Profile</Link>
                <Link to="/expenses" className={navLinkClass}><ListChecks size={18} className="mr-1.5" /> All Expenses</Link>

                <div className="flex items-center space-x-4 ml-4">
                  <div className="text-sm text-gray-600 flex items-center">
                    <User size={18} className="mr-1 text-indigo-500" />
                    Hello, <span className="font-bold ml-1 text-indigo-700 uppercase">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition shadow-md hover:shadow-lg"
                  >
                    <LogOut size={16} className="mr-1.5" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass}><LogIn size={18} className="mr-1.5" /> Login</Link>
                <Link to="/register" className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md shadow-indigo-300/50 hover:shadow-lg">
                  <UserPlus size={18} className="mr-1.5" /> Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link to="/" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-indigo-50 transition" onClick={() => setIsMenuOpen(false)}><Home size={18} className="mr-2 text-indigo-500" /> Home</Link>
                  <Link to="/profile" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-indigo-50 transition" onClick={() => setIsMenuOpen(false)}><User size={18} className="mr-2 text-indigo-500" /> Profile</Link>
                  <Link to="/expenses" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-indigo-50 transition" onClick={() => setIsMenuOpen(false)}><ListChecks size={18} className="mr-2 text-indigo-500" /> All Expenses</Link>

                  <div className="px-3 py-2 text-gray-700 border-t mt-1 pt-3">
                    Hello, <span className="font-bold text-indigo-600 uppercase">{user.name}</span>
                  </div>

                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600 rounded-md hover:bg-red-50 transition">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-indigo-50 transition" onClick={() => setIsMenuOpen(false)}><LogIn size={18} className="mr-2 text-indigo-500" /> Login</Link>
                  <Link to="/register" className="flex items-center px-3 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition" onClick={() => setIsMenuOpen(false)}><UserPlus size={18} className="mr-2" /> Register</Link>
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
