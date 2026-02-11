import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Loading from "./component/Loading";
import PageWrapper from "./component/PageWrapper";
import './index.css';

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const WithAmount = lazy(() => import("./pages/WithAmount"));
const WithoutAmount = lazy(() => import("./pages/WithOutAmount"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Tutorial = lazy(() => import("./pages/Tutorial"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Verification Pages
const EmailVerification = lazy(() => import('./pages/verification/EmailVerification'));
const CheckEmailLoading = lazy(() => import('./pages/verification/CheckEmailLoading'));
const VerifyOTP = lazy(() => import('./pages/verification/VerifyOTP'));

// 🔒 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// 🔓 Public Route Component
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-grow">
        <Suspense fallback={<Loading />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Auth Routes (Public) */}
              <Route path="/login" element={
                <PublicRoute>
                  <PageWrapper>
                    <Login />
                  </PageWrapper>
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <PageWrapper>
                    <Register />
                  </PageWrapper>
                </PublicRoute>
              } />

              {/* Protected App Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                </ProtectedRoute>
              } />
              <Route path="/with-ammount/:id" element={
                <ProtectedRoute>
                  <PageWrapper>
                    <WithAmount />
                  </PageWrapper>
                </ProtectedRoute>
              } />
              <Route path="/without-amount/:id" element={
                <ProtectedRoute>
                  <PageWrapper>
                    <WithoutAmount />
                  </PageWrapper>
                </ProtectedRoute>
              } />

              {/* Public Pages */}
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/tutorial" element={<PageWrapper><Tutorial /></PageWrapper>} />
              <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
              <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
              <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
              <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
              <Route path="/blog/:id" element={<PageWrapper><BlogPost /></PageWrapper>} />

              {/* Verification Routes */}
              <Route path="/verify-email/:token" element={<PageWrapper><EmailVerification /></PageWrapper>} />
              <Route path="/check-email" element={<PageWrapper><CheckEmailLoading /></PageWrapper>} />
              <Route path="/verify-otp" element={<PageWrapper><VerifyOTP /></PageWrapper>} />

              {/* Temporary Loading Demo Route */}
              <Route path="/test-loading" element={<Loading />} />

              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />

            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

export default App;