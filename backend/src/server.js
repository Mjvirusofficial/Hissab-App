const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const withoutAmountRoutes = require("./routes/withoutAmountRoutes");

const app = express();

// ✅ Database Connection
connectDB();

// ✅ Advanced CORS Configuration
// Humne origin function ko thoda simple rakha hai taaki crash na ho
const allowedOrigins = ["https://hisaab-mj.netlify.app", "http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    // browser requests (origin null nahi hota) check karne ke liye
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Error'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Body Parser
app.use(express.json());

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use("/withoutAmount", withoutAmountRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("API is Live with Email Verification!");
});

// ✅ Global Error Handler (Crashes se bachane ke liye)
app.use((err, req, res, next) => {
  if (err.message === 'CORS Policy Error') {
    res.status(403).json({ message: "CORS not allowed" });
  } else {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});