const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
// We use dynamic import for node-fetch or standard require if version allows. 
// Since this is CJS, we'll use a specific way or rely on fetch if Node 18+.
// If 'node-fetch' v3 is installed, it is ESM only, which causes issues in CJS.
// We will try to use global fetch (Node 18+) or fallback to https. 
// TO BE SAFE: We will use native 'https' module to avoid dependency hell if node-fetch is ESM.
const https = require('https');

const verifyGoogleToken = (token) => {
  return new Promise((resolve, reject) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(new Error('Failed to parse Google response'));
          }
        } else {
          reject(new Error('Invalid Google Token'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 1. Try verifying as our Custom JWT
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.userId = decoded.id;
        // Optionally fetch user to be safe if controllers need req.user
        // req.user = await User.findById(decoded.id).select('-password');
        return next();
      } catch (jwtError) {
        // If JWT verify fails, we proceed to check if it's a Firebase Token
        // Don't return error yet
      }

      // 2. Verify as Firebase/Google Token
      const firebaseUser = await verifyGoogleToken(token);

      if (firebaseUser && firebaseUser.email) {
        // Token is valid Google/Firebase token
        let user = await User.findOne({ email: firebaseUser.email });

        if (!user) {
          // Create new user for Firebase login
          const randomPassword = crypto.randomBytes(16).toString('hex');
          user = await User.create({
            name: firebaseUser.name || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            password: randomPassword,
            isVerified: true
          });
        }

        // Attach user info to req
        req.userId = user._id; // For consistency
        req.user = user;       // For controllers that might use req.user
        return next();
      }

    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };