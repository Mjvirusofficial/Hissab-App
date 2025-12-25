const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now }
});

const withoutAmountExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: { type: String, required: true, trim: true },
    products: [productSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// total spent (dynamic)
withoutAmountExpenseSchema.virtual("totalSpent").get(function () {
  return this.products.reduce((s, p) => s + p.amount, 0);
});

module.exports = mongoose.model(
  "WithoutAmountExpense",
  withoutAmountExpenseSchema
);
