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

/* =============================================================
   🔗 EMAIL VERIFICATION ROUTE (START)
   Aapke controller mein 'req.query' use ho raha hai,
   isliye route simple '/verify-email' hona chahiye.
   ============================================================= */
router.get('/verify-email', verifyEmail); 
/* =============================================================
   🔗 EMAIL VERIFICATION ROUTE (END)
   ============================================================= */

// Protected route
router.get('/profile', protect, getUserProfile);

module.exports = router;