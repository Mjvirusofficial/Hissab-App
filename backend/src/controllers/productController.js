const Expense = require("../models/Expense");
const WithoutAmountExpense = require("../models/WithoutAmountExpense");

// =============== WITH AMOUNT =================

// Add product (WITH amount)
exports.addProduct = async (req, res) => {
  try {
    const { name, amount, date } = req.body;
    const expense = await Expense.findById(req.params.expenseId);

    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    expense.products.push({ name, amount, date: date || new Date() });
    await expense.save();

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete product (WITH amount)
exports.deleteProduct = async (req, res) => {
  try {
    const { expenseId, productId } = req.params;
    const expense = await Expense.findById(expenseId);

    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    expense.products = expense.products.filter(p => p._id.toString() !== productId);
    await expense.save();

    res.json({ success: true, message: "Product deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== WITHOUT AMOUNT =================

// Add product (WITHOUT amount)
exports.addProductToWithoutAmountExpense = async (req, res) => {
  try {
    const { name, amount, date } = req.body;
    const expense = await WithoutAmountExpense.findById(req.params.expenseId);

    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    expense.products.push({ name, amount, date: date || new Date() });
    await expense.save();

    res.status(201).json({ success: true, data: expense });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete product (WITHOUT amount)
exports.deleteProductFromWithoutAmountExpense = async (req, res) => {
  try {
    const { expenseId, productId } = req.params;
    const expense = await WithoutAmountExpense.findById(expenseId);

    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    expense.products = expense.products.filter(p => p._id.toString() !== productId);
    await expense.save();

    res.json({ success: true, message: "Product deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
