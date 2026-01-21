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

// ==================== EASY & FLEXIBLE CORS SETUP ====================
// Taaki Mobile aur Laptop dono se request accept ho jaye
app.use(cors({
  origin: true, // Yeh sabhi valid origins ko allow kar dega (Best for mobile debugging)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// OPTIONS requests ko handle karna zaroori hai (Pre-flight)
app.options('*', cors()); 

app.use(express.json());

// Routes Setup
app.use('/api/auth', authRoutes); // Recommended: '/api' prefix lagana achha hota hai
app.use('/api/expenses', expenseRoutes);
app.use("/api/withoutAmount", withoutAmountRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running smoothly...');
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
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