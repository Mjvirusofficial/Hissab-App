const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile,
    verifyOTP  // Humne controller mein iska naam verifyOTP rakha hai
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

/* =============================================================
    🔗 OTP VERIFICATION ROUTE
    Frontend se OTP post karne ke liye
   ============================================================= */
router.post('/verify-otp', verifyOTP); 

// Protected route
router.get('/profile', protect, getUserProfile);

module.exports = router;