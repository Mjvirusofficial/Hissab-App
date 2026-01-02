const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile,
    verifyOTP // ✅ Sahi function import kiya gaya hai
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ================= PUBLIC ROUTES =================

// 1. Naya account banane ke liye (OTP bhejega)
router.post('/register', registerUser);

// 2. Login karne ke liye (Check karega account verified hai ya nahi)
router.post('/login', loginUser);

// 3. OTP Verify karne ke liye (Backend controller ke verifyOTP function ko hit karega)
router.post('/verify-otp', verifyOTP);

// ================= PROTECTED ROUTES =================

// 4. User profile dekhne ke liye (Sirf login ke baad)
router.get('/profile', protect, getUserProfile);

module.exports = router;