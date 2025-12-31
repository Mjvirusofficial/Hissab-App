const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); 
const crypto = require('crypto');          

// ---------------------------------------------------------
// 🛠️ UTILITY FUNCTIONS
// ---------------------------------------------------------
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

/* =============================================================
   🚀 EMAIL SENDER UTILITY (START)
   ============================================================= */
const sendVerificationEmail = async (userEmail, token) => {
    // Check if env variables are present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("❌ ERROR: EMAIL_USER or EMAIL_PASS is missing in Environment Variables!");
        throw new Error("Email configuration missing on server");
    }

    const verificationUrl = `https://hisaab-mj.netlify.app/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Hissab App" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Account Verification - Hissab App",
        html: `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
                <h2>Welcome to Hissab App!</h2>
                <p>Aapka account register ho gaya hai. Login karne ke liye pehle apna email verify karein:</p>
                <a href="${verificationUrl}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Now</a>
                <p style="margin-top: 20px;">Agar button kaam nahi kar raha, toh is link ko copy karein:</p>
                <p>${verificationUrl}</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to:", userEmail);
    } catch (error) {
        console.error("❌ Nodemailer Error:", error.message);
        throw error; // Rethrow to catch in registerUser
    }
};
/* =============================================================
   🚀 EMAIL SENDER UTILITY (END)
   ============================================================= */


// @desc    Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await User.create({
            name,
            email,
            password,
            isVerified: false, 
            verificationToken: verificationToken, 
        });

        // Email bhejna
        try {
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailErr) {
            // Agar email fail ho jaye toh user ko delete kar dena chahiye taaki wo dubara try kar sake
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ 
                success: false, 
                message: 'Error sending verification email. Please try again later.',
                error: emailErr.message 
            });
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
        });
    } catch (error) {
        console.error("🔥 Register Error:", error.message);
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
            
            if (!user.isVerified) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Please verify your email before logging in.' 
                });
            }

            const token = generateToken(user._id);
            res.json({
                success: true,
                message: 'Login successful',
                data: { _id: user._id, name: user.name, email: user.email, token }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query; 

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined; 
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully! You can now login.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Verification error' });
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

module.exports = { registerUser, loginUser, getUserProfile, verifyEmail };