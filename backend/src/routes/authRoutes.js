// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    verifyOTP, // Link verification function
    getUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// 1. Register: User data bhejne ke liye POST
router.post('/register', registerUser);

// 2. Login: Credentials bhejne ke liye POST
router.post('/login', loginUser);

// 3. Email Link Verification: Link par click karne ke liye GET method zaroori hai
// URL format: /auth/verify/123abctoken
router.get('/verify/:token', verifyOTP); 

// 4. Profile: Protected route GET method ke saath
router.get('/profile', protect, getUserProfile);

module.exports = router;