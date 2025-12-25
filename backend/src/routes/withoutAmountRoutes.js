const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const withoutAmountController = require("../controllers/withoutAmountController");
const productController = require("../controllers/productController");

router.use(protect);

// ================= WITHOUT AMOUNT =================

// expense routes
router.get("/", withoutAmountController.getWithoutAmountExpenses);
router.post("/create", withoutAmountController.createWithoutAmountExpense);
router.get("/:id", withoutAmountController.getWithoutAmountExpenseById);
router.delete("/:id", withoutAmountController.deleteWithoutAmountExpense);

// products inside WITHOUT amount expense
router.post(
  "/:expenseId/products",
  productController.addProductToWithoutAmountExpense
);

router.delete(
  "/:expenseId/products/:productId",
  productController.deleteProductFromWithoutAmountExpense
);

module.exports = router;
