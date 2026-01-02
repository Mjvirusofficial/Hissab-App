import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import WithAmount from "./pages/WithAmount";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./component/Navbar";
import WithoutAmount from "./pages/WithOutAmount";
import Footer from "./component/Footer";
import EmailVerification from './pages/verification/EmailVerification';
import CheckEmailLoading from './pages/verification/CheckEmailLoading';
import VerifyOTP from './pages/verification/VerifyOTP';

import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        {/* Main Content Area */}
        <div className="flex-grow">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* App Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/with-ammount/:id" element={<WithAmount />} />
            <Route path="/without-amount/:id" element={<WithoutAmount />} />

            {/* ================= VERIFICATION ROUTES START ================= */}
            {/* Yahan :token lagana zaroori hai taaki verification link se 
               data uthaya ja sake 
            */}
            <Route path="/verify-email/:token" element={<EmailVerification />} />

            {/* Registration ke turant baad dikhane wala loading page */}
            <Route path="/check-email" element={<CheckEmailLoading />} />
            {/* ================= VERIFICATION ROUTES END ================== */}
            <Route path="/verify-otp" element={<VerifyOTP />} />
            {/* 404 Redirect: Agar koi galat URL daale toh Home par bhej do */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;