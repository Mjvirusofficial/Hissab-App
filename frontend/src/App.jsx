import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import WithAmount from "./pages/WithAmount";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./component/Navbar";
import WithoutAmount from "./pages/WithOutAmount";
import Footer from "./component/Footer";

/* =============================================================
   🔗 NEW OTP PAGE IMPORT (START)
   ============================================================= */
import OTPVerification from "./pages/OTPVerification"; 
/* =============================================================
   🔗 NEW OTP PAGE IMPORT (END)
   ============================================================= */

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          /* =============================================================
             🔗 NEW OTP ROUTE (START)
             ============================================================= */
          <Route path="/verify-otp" element={<OTPVerification />} />
          /* =============================================================
             🔗 NEW OTP ROUTE (END)
             ============================================================= */

          {/* Home / Dashboard */}
          <Route path="/" element={<Home />} />
          
          <Route path="/with-ammount/:id" element={<WithAmount />} />
          <Route path="/without-amount/:id" element={<WithoutAmount />} />

          {/* Redirect to home if no route matches */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;