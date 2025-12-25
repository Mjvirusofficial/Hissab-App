const WithoutAmountExpense = require("../models/WithoutAmountExpense");

// ================= WITHOUT AMOUNT ONLY =================

// GET all
exports.getWithoutAmountExpenses = async (req, res) => {
  try {
    const expenses = await WithoutAmountExpense.find({ userId: req.userId });
    res.json({ success: true, data: expenses });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE
exports.createWithoutAmountExpense = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ success: false, message: "Name required" });

    const expense = await WithoutAmountExpense.create({
      userId: req.userId,
      name: name.trim(),
      products: []
    });

    res.status(201).json({ success: true, data: expense });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET by ID
exports.getWithoutAmountExpenseById = async (req, res) => {
  try {
    const expense = await WithoutAmountExpense.findById(req.params.id);

    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    res.json({ success: true, data: expense });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD product
exports.addProductToWithoutAmountExpense = async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (!name || !amount)
      return res.status(400).json({ success: false, message: "Name & amount required" });

    const expense = await WithoutAmountExpense.findById(req.params.id);
    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    expense.products.push({ name, amount });
    await expense.save();

    res.json({ success: true, data: expense });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE expense
exports.deleteWithoutAmountExpense = async (req, res) => {
  try {
    const expense = await WithoutAmountExpense.findById(req.params.id);
    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    await expense.deleteOne();
    res.json({ success: true, message: "Deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE product
exports.deleteProductFromWithoutAmountExpense = async (req, res) => {
  try {
    const { expenseId, productId } = req.params;

    const expense = await WithoutAmountExpense.findById(expenseId);
    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    expense.products = expense.products.filter(
      p => p._id.toString() !== productId
    );

    await expense.save();
    res.json({ success: true, data: expense });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
