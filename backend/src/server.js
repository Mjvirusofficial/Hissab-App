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
app.use(cors({
  origin: ["https://hisaab-mj.netlify.app", "http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // OPTIONS zaroori hai
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true 
}));

// Pre-flight requests (OPTIONS) ko handle karne ke liye
app.options("*", cors()); 

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use("/withoutAmount", withoutAmountRoutes);

app.get("/", (req, res) => {
  res.send("API is Live with Email Verification!");
});

// ✅ Error Handling Middleware (Crashes rokne ke liye)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});