const mongoose = require("mongoose");

// product schema (expense ke andar items)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// main expense schema (WITH amount only)
const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    products: [productSchema]
  },
  { timestamps: true }
);

// spent amount
expenseSchema.virtual("spent").get(function () {
  return this.products.reduce((sum, p) => sum + p.amount, 0);
});

// remaining amount
expenseSchema.virtual("remaining").get(function () {
  return this.totalAmount - this.spent;
});

module.exports = mongoose.model("Expense", expenseSchema);
