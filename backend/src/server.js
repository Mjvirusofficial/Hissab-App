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

// Middleware

app.use(cors({
  origin: "https://hissab-4ggc.onrender.com", // Jo aapka live frontend link hai
  credentials: true 
}));

app.use(cors()); // Sabhi origins allow hain (Development ke liye best)
app.use(express.json());

// Routes Setup
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use("/withoutAmount", withoutAmountRoutes);

// Basic route 
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running smoothly...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

