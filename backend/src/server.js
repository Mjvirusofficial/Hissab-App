const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const withoutAmountRoutes = require("./routes/withoutAmountRoutes");

connectDB();
const app = express();

// ✅ SIRF EK BAAR CORS USE KAREIN (Multiple origins ke saath)
app.use(cors({
  origin: ["https://hisaab-mj.netlify.app", "http://localhost:5173"], 
  credentials: true 
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use("/withoutAmount", withoutAmountRoutes);

app.get('/', (res, req) => {
  res.send('API is Live!');
});

// Is line ko dhundhein aur aise fix karein
app.get("/", (req, res) => {  // Pehle 'req', phir 'res' hona chahiye
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});