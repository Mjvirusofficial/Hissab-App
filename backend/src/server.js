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

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://hisaab-mj.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes Setup
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use("/withoutAmount", withoutAmountRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running smoothly...');
});

// Error Handling for CORS or other issues
app.use((err, req, res, next) => {
  if (err.message === 'CORS Policy: This origin is not allowed!') {
    res.status(403).json({ success: false, message: err.message });
  } else {
    next(err);
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});