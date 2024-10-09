import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import monthlyBudgetReducer from "./monthlyBudgetSlice";
import categoryReducer from "./categorySlice";
import categoryBudgetReducer from "./categoryBudgetSlice";
import expenseReducer from "./expenseSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    monthlyBudget: monthlyBudgetReducer,
    category: categoryReducer,
    categoryBudget: categoryBudgetReducer,
    expense : expenseReducer  
  },
});

export default store;
