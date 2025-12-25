import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
  },
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push({
        id: action.payload.id, // id Home se aayegi
        name: action.payload.name,
        amount: Number(action.payload.amount),
        products: [],
      });
    },

    addProductToExpense: (state, action) => {
      const { expenseId, product } = action.payload;
      const exp = state.expenses.find((e) => e.id === expenseId);
      if (exp) {
        exp.products.push(product);
      }
    },

    deleteProduct: (state, action) => {
      const { expenseId, productId } = action.payload;
      const exp = state.expenses.find((e) => e.id === expenseId);
      if (exp) {
        exp.products = exp.products.filter((p) => p.id !== productId);
      }
    },
  },
});

export const { addExpense, addProductToExpense, deleteProduct } = expenseSlice.actions;
export default expenseSlice.reducer;
