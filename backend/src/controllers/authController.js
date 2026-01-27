const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Token generator for final login and temporary activation
const generateToken = (payload, expiry = '30d') => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret123', {
        expiresIn: expiry
    });
};

// @desc    1. Register user (Only sends OTP, DOES NOT SAVE to DB)
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        // Check if user already exists in DB
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 📝 Yahan data save karne ki jagah ek temporary Token bana rahe hain
        // Is token mein user ka sara data (password ke sath) chupa hoga
        const activationToken = generateToken({ name, email, password, otp }, '10m');

        // Send OTP Email
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: process.env.EMAIL_PORT || 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Hisaab App - Your OTP Code',
                html: `<div style="font-family: Arial; padding: 20px;">
                        <h2>Verify Your Email</h2>
                        <h1 style="background: #f4f4f4; text-align: center; letter-spacing: 10px;">${otp}</h1>
                        <p>This code expires in 10 minutes.</p>
                       </div>`
            });
        } catch (mailErr) {
            console.error("❌ Email Error:", mailErr.message);
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent! Please verify to complete registration.',
            activationToken, // 👈 Yeh token Frontend ko dena zaroori hai
            email
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    2. Verify OTP & SAVE User to Database
const verifyOTP = async (req, res) => {
    try {
        const { otp, activationToken } = req.body;

        if (!activationToken) {
            return res.status(400).json({ success: false, message: 'Session expired. Please register again.' });
        }

        // Decode the temporary token
        let decoded;
        try {
            decoded = jwt.verify(activationToken, process.env.JWT_SECRET || 'secret123');
        } catch (err) {
            return res.status(400).json({ success: false, message: 'OTP Expired. Please register again.' });
        }

        // Check if OTP matches
        if (decoded.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // ✅ OTP Match ho gaya! Ab user ko Database mein save karein
        const user = await User.create({
            name: decoded.name,
            email: decoded.email,
            password: decoded.password, // Password User model mein automatically hash hoga
            isVerified: true
        });

        res.status(201).json({
            success: true,
            message: 'Account Created & Verified!',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken({ id: user._id })
            }
        });
    } catch (err) {
        console.error("❌ Verification Error:", err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Login user (Simple logic as unverified users don't exist in DB)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken({ id: user._id }),
                },
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc Login with Google (Firebase Token)
const loginWithGoogle = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ success: false, message: 'Token required' });

        // 1. Verify Firebase ID Token via Identity Toolkit API
        // This works for ALL Firebase tokens (Google, Email, Phone) and doesn't require Admin SDK/Service Account.
        const apiKey = process.env.FIREBASE_API_KEY;
        if (!apiKey) {
            console.error("FIREBASE_API_KEY missing in backend .env");
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }

        const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
        const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

        const response = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: token })
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error("Firebase Verification Failed:", errData);
            return res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
        }

        const data = await response.json();
        const firebaseUser = data.users[0];

        const { email, displayName, localId } = firebaseUser;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email not found in token' });
        }

        // 2. Find or Create User
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: displayName || 'User',
                email,
                password: localId, // Placeholder password
                isVerified: true
            });
        }

        // 3. Issue Custom JWT
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken({ id: user._id })
            }
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { registerUser, verifyOTP, loginUser, getUserProfile, loginWithGoogle };