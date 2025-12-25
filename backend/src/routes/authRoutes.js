const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile,
    verifyEmail 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🚀 LIVE: Jab email verification chalu karna ho, tab is niche wali line ko uncomment karein
router.get('/verify-email/:token', verifyEmail);

// Protected route
router.get('/profile', protect, getUserProfile);

module.exports = router;