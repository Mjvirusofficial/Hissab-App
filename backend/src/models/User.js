const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  /* ==========================================
     🚀 EMAIL VERIFICATION BLOCK (START)
     Is section ko email functionality ke liye 
     use kiya gaya hai.
  ========================================== */
  isVerified: {
    type: Boolean,
    default: false, // Default false rahega
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  },
  /* ==========================================
     🚀 EMAIL VERIFICATION BLOCK (END)
  ========================================== */

}, { timestamps: true });

// Password Hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match Password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;