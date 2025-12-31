const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const withoutAmountRoutes = require("./routes/withoutAmountRoutes");

connectDB();
const app = express();

app.use(cors({
  origin: ["https://hisaab-mj.netlify.app", "http://localhost:5173"], 
  credentials: true 
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use("/withoutAmount", withoutAmountRoutes);

// ✅ Fixed parameters (req, res)
app.get("/", (req, res) => {
  res.send("API is running and Live!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});