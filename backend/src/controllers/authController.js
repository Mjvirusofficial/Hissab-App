const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); // Step 2 wali file

/* ================= JWT TOKEN ================= */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/* ================= REGISTER (With OTP) ================= */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 2. Generate 6 Digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // 3. Create User (unverified)
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      otp,
      otpExpire
    });

    // 4. Send Email
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
      // Agar email na jaye toh user delete kar dein ya handle karein
      console.error("Mail Error:", mailErr);
      return res.status(500).json({ success: false, message: "Error sending email. Try again." });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= VERIFY OTP (Naya Function) ================= */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // User dhoondhein jiska OTP match kare aur expire na hua ho
    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = undefined; // OTP clear karein
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

/* ================= LOGIN (With Verification Check) ================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // ❌ Agar verified nahi hai toh login mat hone do
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

module.exports = { registerUser, verifyOTP, loginUser };