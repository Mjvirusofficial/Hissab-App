const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers, createUser, deleteUser } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All routes require authentication and Admin role
router.use(protect);
router.use(isAdmin);

router.get('/stats', getAdminStats);
router.route('/users').get(getAllUsers).post(createUser);
router.route('/users/:id').delete(deleteUser);

module.exports = router;
