const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* ================= JWT TOKEN GENERATOR ================= */
const generateToken = (id) => {
  // Check if JWT_SECRET exists in environment variables
  if (!process.env.JWT_SECRET) {
    console.error("CRITICAL ERROR: JWT_SECRET is missing in .env file or Render settings!");
    throw new Error("Server configuration error (JWT)");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/* ================= REGISTER (NO EMAIL VERIFICATION) ================= */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    // 2. Duplicate Check (Important as per your request)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // 3. Create User (Automatically verified)
    const user = await User.create({
      name,
      email,
      password,
      isVerified: true // Direct verification
    });

    // 4. Generate Token
    const token = generateToken(user._id);

    // 5. Success Response
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

/* ================= LOGIN ================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    // Match password
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

/* ================= GET PROFILE ================= */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};