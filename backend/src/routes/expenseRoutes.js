const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");
const productController = require("../controllers/productController");

// protect all expense routes
router.use(protect);

// ================= WITH AMOUNT =================

// expense CRUD
router.get("/", expenseController.getExpenses);
router.post("/", expenseController.createExpense);
router.get("/:id", expenseController.getExpenseById);
router.delete("/:id", expenseController.deleteExpense);

// products inside expense (WITH amount)
router.post("/:expenseId/products", productController.addProduct);
router.delete("/:expenseId/products/:productId", productController.deleteProduct);

module.exports = router;
