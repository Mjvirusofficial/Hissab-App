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
    🔗 LINK VERIFICATION PAGE IMPORT (UPDATED)
   ============================================================= */
// Folder structure ke hisaab se import path check kar lein
import EmailVerification from "./pages/verification/EmailVerification"; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* =============================================================
              🔗 NEW EMAIL VERIFICATION ROUTE (FIXED)
              Yahan /:token lagana zaroori hai taaki URL se token read ho sake
             ============================================================= */}
          <Route path="/verify/:token" element={<EmailVerification />} />

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