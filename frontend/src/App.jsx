import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
// App.jsx or Routes.jsx
import Profile from "./pages/Profile";


import './index.css';

// 🔒 Protected Route Component
// Checks if token exists. If not, redirects to /login.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// 🔓 Public Route Component (Optional but good practice)
// If already logged in, redirects to Dashboard instead of showing Login/Register
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        {/* Main Content Area */}
        <div className="flex-grow">
          <Routes>
            {/* Auth Routes (Public) - Wrapped to prevent access if already logged in */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />

            {/* Protected App Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/with-ammount/:id" element={
              <ProtectedRoute>
                <WithAmount />
              </ProtectedRoute>
            } />
            <Route path="/without-amount/:id" element={
              <ProtectedRoute>
                <WithoutAmount />
              </ProtectedRoute>
            } />

            {/* ================= VERIFICATION ROUTES START ================= */}
            <Route path="/verify-email/:token" element={<EmailVerification />} />
            <Route path="/check-email" element={<CheckEmailLoading />} />
            {/* ================= VERIFICATION ROUTES END ================== */}
            <Route path="/verify-otp" element={<VerifyOTP />} />
            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/profile" element={<Profile />} />

          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;