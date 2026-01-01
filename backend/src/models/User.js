const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },

  /* ==============================================================
     🚀 LIVE SETTINGS (ABHI DISABLED HAIN)
     Jab aap email verification live karenge, tab 'default: true' ko 
     'default: false' kar dena aur niche wale fields ko use karna.
     ==============================================================
  */
  isVerified: {
    type: Boolean,
    default: true, // Abhi ke liye true hai taaki bina verification login ho sake
  },
  // verificationToken: {
  //   type: String, // Live ke waqt isko uncomment kar dena
  // }
  /* ============================================================== */

}, {
  timestamps: true 
});

// ⚡️ PASSWORD HASHING (Register ke waqt password encrypt karne ke liye)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

// ⚡️ MATCH PASSWORD (Login ke waqt password check karne ke liye)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;