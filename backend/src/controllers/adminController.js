const User = require('../models/User');
const Expense = require('../models/Expense');
const WithoutAmountExpense = require('../models/WithoutAmountExpense');

// @desc    Get Dashboard Statistics
// @route   GET /admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalExpenses = await Expense.countDocuments();
        const totalWithoutAmount = await WithoutAmountExpense.countDocuments();

        // Optionally calculate total money logged in Expenses
        const allExpenses = await Expense.find();
        let totalMoney = 0;
        allExpenses.forEach(exp => {
            totalMoney += exp.totalAmount;
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                totalExpenses,
                totalWithoutAmount,
                totalMoney
            }
        });
    } catch (error) {
        console.error("Admin Stats Error:", error.message);
        res.status(500).json({ success: false, message: 'Server Error Fetching Stats' });
    }
};

// @desc    Get All Users List
// @route   GET /admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

        // Parallel fetching counts for all users for better performance
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const [expenseCount, withoutAmountCount] = await Promise.all([
                Expense.countDocuments({ userId: user._id }),
                WithoutAmountExpense.countDocuments({ userId: user._id })
            ]);

            return {
                ...user,
                expenseCount,
                withoutAmountCount
            };
        }));

        res.json({
            success: true,
            count: usersWithStats.length,
            data: usersWithStats
        });
    } catch (error) {
        console.error("Admin Get Users Error:", error.message);
        res.status(500).json({ success: false, message: 'Server Error Fetching Users' });
    }
};

// @desc    Delete User
// @route   DELETE /admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Delete their expenses as well
        await Expense.deleteMany({ userId: user._id });
        await WithoutAmountExpense.deleteMany({ userId: user._id });

        await user.deleteOne();

        res.json({ success: true, message: 'User and their expenses removed' });
    } catch (error) {
        console.error("Admin Delete User Error:", error.message);
        res.status(500).json({ success: false, message: 'Server Error Deleting User' });
    }
};

// @desc    Create User (Directly by Admin)
// @route   POST /admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
            isVerified: true
        });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Admin Create User Error:", error.message);
        res.status(500).json({ success: false, message: 'Server Error Creating User' });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    createUser,
    deleteUser
};
