const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); 

/* ================= JWT TOKEN ================= */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/* ================= REGISTER (Fixed) ================= */
const registerUser = async (req, res, next) => { 
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; 

    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      otp,
      otpExpire
    });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Hissab App - Verify Your Email',
        message: `Your OTP for registration is: ${otp}. It is valid for 10 minutes.`
      });

      res.status(201).json({
        success: true,
        message: "OTP sent to your email. Please verify."
      });
    } catch (mailErr) {
      await User.findByIdAndDelete(user._id);
      console.error("Mail Error:", mailErr);
      return res.status(500).json({ success: false, message: "Email service error. Try again." });
    }

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= VERIFY OTP ================= */
const verifyOTP = async (req, res, next) => { 
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      token,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= LOGIN ================= */
const loginUser = async (req, res, next) => { 
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Your email is not verified. Please verify first."
      });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: "Login successful",
      data: { _id: user._id, name: user.name, email: user.email, token }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET USER PROFILE ================= */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { registerUser, verifyOTP, loginUser, getUserProfile };