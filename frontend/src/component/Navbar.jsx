import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Home, 
  User, 
  Menu,
  X,
  BookOpen,
  HelpCircle,
  Phone,
  Info,
  ChevronRight,
  ClipboardList,
  LogOut,
  Bell,
  TrendingUp,
  FileText
} from "lucide-react";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuth = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setUser({
            name: data.user?.name || data.displayName || "User",
            email: data.user?.email || data.email,
          });
        } catch (e) {}
      } else {
        setUser(null);
      }
    };

    handleAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser && !localStorage.getItem("token")) setUser(null);
    });
    window.addEventListener("authChange", handleAuth);
    return () => {
      unsubscribe();
      window.removeEventListener("authChange", handleAuth);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await signOut(auth);
    setUser(null);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const getActiveTabId = () => {
    if (location.pathname === '/') {
      return location.search === '?tab=daily' ? 'daily' : 'budget';
    }
    if (location.pathname === '/profile') return 'profile';
    return '';
  };
  const activeTabId = getActiveTabId();

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsHeaderVisible(currentScroll < 20);
      setHasScrolled(currentScroll > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const tabs = [
    { path: "/?tab=budget", id: 'budget', icon: Home, label: "Home", color: 'border-indigo-600' },
    { path: "/?tab=daily", id: 'daily', icon: FileText, label: "Daily Expense", color: 'border-lime-500' },
    { path: "/profile", id: 'profile', icon: User, label: "Profile", color: 'border-indigo-600' },
    { path: "more", id: 'more', icon: Menu, label: "More", color: 'border-indigo-600' },
  ];

  const handleTabClick = (tab) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (tab.path === "more") {
      setIsMenuOpen(true);
    } else {
      navigate(tab.path);
    }
  };

  // Determine current active color
  const currentTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  
  // New Logic: Only show color if scrolled
  let activeBorderColor = 'border-gray-50'; // Default subtle
  if (hasScrolled) {
    activeBorderColor = currentTab.color;
  }

  return (
    <>
      {/* --- TOP HEADER: PREMIUM FLOATING DESIGN --- */}
      <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -120 }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="fixed top-3 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 h-16 md:h-20 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-between px-5 md:px-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      >
        <Link to="/" onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-transform duration-300 italic">{localStorage.getItem('user_currency') || '₹'}</div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-600 tracking-tight">D-Hisaab</span>
              <span className="text-[9px] font-medium text-gray-500 pl-0.5 mt-0.5 tracking-wide">Simple, Secure, Smart Accounting :)</span>
            </div>
        </Link>

        {user && (
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsNotificationOpen(true)} className="relative p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 group">
              <Bell size={22} strokeWidth={2.5} className="group-hover:shake" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
          </div>
        )}
      </motion.nav>

      {/* Spacer to prevent content jump */}
      <div className="h-20" />

      {/* --- FULL-WIDTH TOP-ROUNDED BOTTOM NAVIGATION (Responsive for All Screens) --- */}
      {user && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[2.5rem] md:rounded-t-[3rem] h-17 md:h-20 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t-4 transition-all duration-500 pb-1 md:pb-2 ${activeBorderColor}`}>
          <div className="w-full h-full flex items-center justify-around px-2 md:px-10 max-w-7xl mx-auto">
            {tabs.map(tab => {
              const active = tab.id === activeTabId;
              const Icon = tab.icon;

              return (
                <button 
                  key={tab.label}
                  onClick={() => handleTabClick(tab)}
                  className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-300 ${active ? (tab.id === 'daily' ? 'text-lime-600' : 'text-indigo-600') : "text-gray-400"}`}
                >
                  <motion.div whileTap={{ scale: 0.8 }} className="relative z-10 transition-colors">
                    <Icon size={20} className="md:w-6 md:h-6" strokeWidth={active ? 2.5 : 2} />
                  </motion.div>
                  <span className={`text-[9px] md:text-xs font-bold mt-1 relative z-10 transition-colors ${active ? "opacity-100" : "opacity-80"} leading-tight text-center px-1`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- ELEGANT SIDE MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col rounded-l-[2rem] overflow-hidden">
               <div className="p-8 border-b bg-indigo-600 text-white flex justify-between items-center">
                 <div>
                   <h2 className="text-xl font-bold">Account</h2>
                   <p className="text-indigo-100 text-xs mt-1">{user?.email}</p>
                 </div>
                 <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"><X size={24} /></button>
               </div>
               
               <div className="flex-grow p-6 overflow-y-auto space-y-4">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-2">Support & Info</p>
                  {[
                    { icon: BookOpen, title: "How to use", path: "/tutorial" },
                    { icon: HelpCircle, title: "Support/FAQ", path: "/faq" },
                    { icon: Info, title: "About App", path: "/about" },
                    { icon: Phone, title: "Contact Us", path: "/contact" },
                  ].map((item, idx) => (
                    <Link key={idx} to={item.path} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl group transition-all">
                      <div className="flex items-center space-x-4">
                        <item.icon size={20} className="text-indigo-500" />
                        <span className="font-bold text-gray-700">{item.title}</span>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
               </div>

               <div className="p-6 border-t mt-auto">
                  <button onClick={handleLogout} className="w-full p-4 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all">
                    <LogOut size={20} />
                    <span>Logout Account</span>
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* --- NOTIFICATION DRAWER (LEFT SIDE) --- */}
      <AnimatePresence>
        {isNotificationOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNotificationOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col rounded-r-[2rem] overflow-hidden">
               <div className="p-8 border-b bg-gray-50 flex justify-between items-center">
                 <div>
                   <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                   <p className="text-gray-500 text-xs mt-1">Updates specifically for you</p>
                 </div>
                 <button onClick={() => setIsNotificationOpen(false)} className="p-2 bg-white border border-gray-100 shadow-sm rounded-full hover:bg-gray-100 transition-colors"><X size={20} className="text-gray-600" /></button>
               </div>
               
               <div className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Bell size={32} className="text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">You're all caught up!</h3>
                  <p className="text-sm text-gray-500 mt-2 px-2">Kafi shanti hai yahan... 😉 <br/> Filhaal koi nayi notification ya expense alert nahi aaya hai.</p>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}

export default Navbar;
