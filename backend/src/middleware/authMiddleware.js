const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    
    // ✅ Controller ke 'req.user.id' se match karne ke liye
    req.user = { id: decoded.id }; 
    
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };