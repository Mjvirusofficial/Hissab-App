const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

// @desc    Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Debugging: Terminal mein check karne ke liye data aa raha hai ya nahi
        console.log("Registering user:", { name, email });

        // Check if data is missing
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        const user = await User.create({
            name,
            email,
            password, // Hashing User.js model handle karega
            isVerified: true, 
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            data: { 
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                token 
            }
        });
    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            res.json({
                success: true,
                message: 'Login successful',
                data: { 
                    _id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    token 
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const id = req.userId || req.user?._id;
        const user = await User.findById(id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const verifyEmail = async (req, res) => {
    res.status(200).json({ success: true, message: 'Bypassed' });
};

module.exports = { registerUser, loginUser, getUserProfile, verifyEmail };