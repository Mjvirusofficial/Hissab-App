const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// Routes Import
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const withoutAmountRoutes = require("./routes/withoutAmountRoutes");

// Connect to Database
connectDB();

const app = express();

// ==================== GLOBAL CORS (NO WILDCARDS) ====================
// Is tareeke se 'path-to-regexp' ka error kabhi nahi aayega
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Purani line 'app.options('*', ...)' ko poori tarah hata diya gaya hai
// Kyunki CORS middleware khud hi OPTIONS handle kar leta hai agar sahi se set ho.

app.use(express.json());

// ==================== ROUTES SETUP ====================

app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use("/withoutAmount", withoutAmountRoutes);

// Simple route without any special characters
app.get('/', (req, res) => {
  res.send('API is running perfectly!');
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Something went wrong on the server" 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const connectDB = require('./config/database');

// // Routes Import
// const authRoutes = require('./routes/authRoutes');
// const expenseRoutes = require('./routes/expenseRoutes');
// const withoutAmountRoutes = require("./routes/withoutAmountRoutes");

// // Connect to Database
// connectDB();

// const app = express();

// // ==================== UPDATED CORS MIDDLEWARE ====================
// const allowedOrigins = [
//   'http://localhost:3000',      // Local React (Create React App)
//   'http://localhost:5173',      // Local React (Vite)
//   'https://hisaab-mj.netlify.app' // Aapka Live Frontend
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Mobile apps ya curl requests mein origin nahi hota, unhe allow karein
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS Policy: This origin is not allowed!'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());

// // Routes Setup
// app.use('/auth', authRoutes);
// app.use('/expenses', expenseRoutes);
// app.use("/withoutAmount", withoutAmountRoutes);

// // Basic route
// app.get('/', (req, res) => {
//   res.send('Expense Tracker API is running smoothly...');
// });

// // Error Handling for CORS or other issues
// app.use((err, req, res, next) => {
//   if (err.message === 'CORS Policy: This origin is not allowed!') {
//     res.status(403).json({ success: false, message: err.message });
//   } else {
//     next(err);
//   }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });