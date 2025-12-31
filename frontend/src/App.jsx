import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import WithAmount from "./pages/WithAmount";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./component/Navbar";
import WithoutAmount from "./pages/WithOutAmount";
import Footer from "./component/Footer";

// ❌ Inki ab zaroorat nahi hai isliye import hata diya
// import EmailVerification from './pages/verification/EmailVerification';
// import CheckEmailLoading from './pages/verification/CheckEmailLoading';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home / Dashboard */}
          <Route path="/" element={<Home />} />
          
          <Route path="/with-ammount/:id" element={<WithAmount />} />
          <Route path="/without-amount/:id" element={<WithoutAmount />} />

          {/* ❌ Verification routes yahan se delete kar diye gaye hain */}

          {/* Redirect to home if no route matches */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;