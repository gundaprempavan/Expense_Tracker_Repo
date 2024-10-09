import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions

// Add a new expense
export const addExpense = createAsyncThunk(
  "expense/add",
  async (expenseData) => {
    const response = await axios.post(
      "http://localhost:5000/api/expense/add",
      expenseData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Include token for authentication
        },
      }
    );
    return response.data.expense; // Returning the created expense
  }
);

// Get all expenses for a user
export const fetchUserExpenses = createAsyncThunk(
  "expense/fetchUserExpenses",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/expense/user/expenses", // Add your endpoint here
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Returning the list of user expenses
  }
);

// Get all expenses for a specific budget
export const fetchBudgetExpenses = createAsyncThunk(
  "expense/fetchAll",
  async (monthlyBudgetId) => {
    const response = await axios.get(
      `http://localhost:5000/api/expense/budget/${monthlyBudgetId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Returning the list of expenses
  }
);

// Get a single expense by ID
export const fetchExpenseById = createAsyncThunk(
  "expense/fetchById",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/expense/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Returning the expense details
  }
);

// Update an existing expense
export const updateExpense = createAsyncThunk(
  "expense/update",
  async ({ id, expenseData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/expense/update/${id}`,
      expenseData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data.expense; // Returning the updated expense
  }
);

// Delete an expense
export const deleteExpense = createAsyncThunk(
  "expense/delete",
  async (id) => {
    await axios.delete(
      `http://localhost:5000/api/expense/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return id; // Returning the id of the deleted expense
  }
);

// Expense slice
const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    selectedExpense: null, // New property to hold the selected expense
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear error message
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload); // Add the new expense to the state
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(fetchBudgetExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload; // Set the fetched expenses
      })
      .addCase(fetchBudgetExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(fetchUserExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload; // Set the fetched user expenses
      })
      .addCase(fetchUserExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(fetchExpenseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpense = action.payload; // Store the fetched expense in the state
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex(
          (expense) => expense.id === action.payload.id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload; // Update the expense in the state
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter(
          (expense) => expense.id !== action.payload
        ); // Remove the deleted expense from the state
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      });
  },
});

// Export actions and reducer
export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer;
