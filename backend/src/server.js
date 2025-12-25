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
  origin: "https://hisaab-mj.netlify.app", // Aapka naya live link
  credentials: true 
}));

app.use(cors()); // Simple CORS for now
app.use(express.json());

// Routes: Bina /api ke direct rakhein
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use("/withoutAmount", withoutAmountRoutes);

app.get('/', (req, res) => {
  res.send('API is Live!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});