const Expense = require("../models/Expense");

// ================= WITH AMOUNT ONLY =================

// GET all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    res.json({ success: true, data: expenses });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE expense
exports.createExpense = async (req, res) => {
  try {
    const { name, totalAmount } = req.body;

    const expense = await Expense.create({
      userId: req.userId,
      name,
      totalAmount,
      products: []
    });

    res.status(201).json({ success: true, data: expense });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET expense by id
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    res.json({ success: true, data: expense });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.userId.toString() !== req.userId)
      return res.status(404).json({ success: false, message: "Expense not found" });

    await expense.deleteOne();
    res.json({ success: true, message: "Expense deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
