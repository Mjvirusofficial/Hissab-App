const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); 
const crypto = require('crypto'); // Built-in module

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// REGISTER (Link wala logic)
const registerUser = async (req, res, next) => { 
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

    // OTP ki jagah ek random string token generate karein
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      otp: verificationToken, // Token ko hi otp field mein save kar rahe hain
    });

    // Verification URL (Netlify frontend ka link)
    const verifyUrl = `https://hisaab-mj.netlify.app/verify/${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Hissab App - Verify Your Email',
        message: `Please click on the link to verify your email: ${verifyUrl}`
      });

      res.status(201).json({ success: true, message: "Verification link sent to email." });
    } catch (mailErr) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ success: false, message: "Email service error." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// VERIFY (Email click par chalne wala)
const verifyEmail = async (req, res, next) => { 
  try {
    const { token } = req.params; // Link se token uthayenge

    const user = await User.findOne({ otp: token });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification link" });
    }

    user.isVerified = true;
    user.otp = undefined; 
    await user.save();

    res.status(200).json({ success: true, message: "Email verified!", token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const loginUser = async (req, res, next) => { 
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(400).json({ success: false, message: "Invalid credentials" });
    if (!user.isVerified) return res.status(401).json({ success: false, message: "Please verify email first." });
    res.json({ success: true, data: { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { registerUser, verifyOTP: verifyEmail, loginUser, getUserProfile };