const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
   📧 EMAIL SENDER (GMAIL SMTP)
   ============================================================= */
const sendVerificationEmail = async (userEmail, token) => {
    if (
        !process.env.EMAIL_HOST ||
        !process.env.EMAIL_PORT ||
        !process.env.EMAIL_USER ||
        !process.env.EMAIL_PASS
    ) {
        throw new Error("Email configuration missing in env");
    }

    const verificationUrl = `https://hisaab-mj.netlify.app/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,       // smtp.gmail.com
        port: Number(process.env.EMAIL_PORT), // 587
        secure: false, // TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Hissab App" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Verify Your Email - Hissab App',
        html: `
            <div style="font-family:Arial;padding:20px;border:1px solid #ddd">
                <h2>Welcome to Hissab App 👋</h2>
                <p>Please verify your email to activate your account:</p>
                <a href="${verificationUrl}"
                   style="display:inline-block;padding:10px 20px;
                   background:#28a745;color:white;text-decoration:none;
                   border-radius:5px;">
                   Verify Email
                </a>
                <p style="margin-top:20px;">Or copy this link:</p>
                <p>${verificationUrl}</p>
            </div>
        `,
    });

    console.log("✅ Verification email sent to:", userEmail);
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

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await User.create({
            name,
            email,
            password,
            isVerified: false,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (err) {
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({
                success: false,
                message: 'Error sending verification email',
                error: err.message,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please verify your email.',
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

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your email before login',
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
   ✅ VERIFY EMAIL
   ============================================================= */
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token',
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully! You can now login.',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email verification failed',
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
    verifyEmail,
    getUserProfile,
};
