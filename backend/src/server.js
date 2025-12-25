const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const withoutAmountRoutes = require("./routes/withoutAmountRoutes");

connectDB();
const app = express();

// ✅ CORS FIX: Sabhi sources allow kar diye hain testing ke liye
app.use(cors({
  origin: "*", 
  credentials: true 
}));

app.use(express.json());

// ✅ ROUTES FIX: Sabke aage /api laga diya hai
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use("/api/withoutAmount", withoutAmountRoutes);

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running smoothly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});