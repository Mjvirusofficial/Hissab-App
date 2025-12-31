const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* =============================================================
   🔐 JWT TOKEN GENERATOR
   ============================================================= */
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET missing in environment variables");
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/* =============================================================
   📝 REGISTER USER
   ============================================================= */
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all fields',
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            isVerified: true, // 🔥 direct verified
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token,
            },
        });
    } catch (error) {
        console.error("🔥 Register Error:", error.message);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/* =============================================================
   🔑 LOGIN USER
   ============================================================= */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/* =============================================================
   👤 GET USER PROFILE
   ============================================================= */
const getUserProfile = async (req, res) => {
    try {
        const id = req.userId || req.user?._id;

        const user = await User.findById(id).select('-password');

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};
