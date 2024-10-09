// src/redux/monthlyBudgetSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions

// Add a new monthly budget
export const addMonthlyBudget = createAsyncThunk(
  "monthlyBudget/add",
  async (budgetData) => {
    const response = await axios.post(
      "http://localhost:5000/api/budget/add",
      budgetData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Include token for authentication
        },
      }
    );
    return response.data; // Returning the created budget
  }
);

// Get all monthly budgets for a user
export const fetchUserMonthlyBudgets = createAsyncThunk(
  "monthlyBudget/fetchAll",
  async () => {
    const response = await axios.get("http://localhost:5000/api/budget", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data; // Returning the list of budgets
  }
);

// Check if a monthly budget exists for a specific month and year
export const checkMonthlyBudgetExists = createAsyncThunk(
  "monthlyBudget/checkExists",
  async ({ month, year }, { dispatch, getState }) => {
    // Fetch user monthly budgets first
    await dispatch(fetchUserMonthlyBudgets());
    const budgets = getState().monthlyBudget.budgets;

    // Check if a budget exists for the specified month and year
    const exists = budgets.some(
      (budget) => new Date(budget.date).getMonth() === month && new Date(budget.date).getFullYear() === year
    );
    return exists; // Returning true or false
  }
);

// Get a single monthly budget by ID
export const fetchMonthlyBudgetById = createAsyncThunk(
  "monthlyBudget/fetchById",
  async (id) => {
    const response = await axios.get(`http://localhost:5000/api/budget/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data; // Returning the budget details
  }
);

// Update an existing monthly budget
export const updateMonthlyBudget = createAsyncThunk(
  "monthlyBudget/update",
  async ({ id, budgetData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/budget/update/${id}`,
      budgetData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Returning the updated budget
  }
);

// Delete a monthly budget
export const deleteMonthlyBudget = createAsyncThunk(
  "monthlyBudget/delete",
  async (id) => {
    await axios.delete(`http://localhost:5000/api/budget/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return id; // Returning the id of the deleted budget
  }
);

// Monthly Budget slice
const monthlyBudgetSlice = createSlice({
  name: "monthlyBudget",
  initialState: {
    budgets: [],
    selectedBudget: null, // New property to hold the selected budget
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
      .addCase(addMonthlyBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMonthlyBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets.push(action.payload); // Add the new budget to the state
      })
      .addCase(addMonthlyBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(fetchUserMonthlyBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMonthlyBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload; // Set the fetched budgets
      })
      .addCase(fetchUserMonthlyBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(checkMonthlyBudgetExists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkMonthlyBudgetExists.fulfilled, (state, action) => {
        state.loading = false;
        state.budgetExists = action.payload; // Store the result (true/false) in state
      })
      .addCase(checkMonthlyBudgetExists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(fetchMonthlyBudgetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyBudgetById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBudget = action.payload; // Store the fetched budget in the state
      })
      .addCase(fetchMonthlyBudgetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(updateMonthlyBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMonthlyBudget.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.budgets.findIndex(
          (budget) => budget.id === action.payload.id
        );
        if (index !== -1) {
          state.budgets[index] = action.payload; // Update the budget in the state
        }
      })
      .addCase(updateMonthlyBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(deleteMonthlyBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMonthlyBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = state.budgets.filter(
          (budget) => budget.id !== action.payload
        ); // Remove the deleted budget from the state
      })
      .addCase(deleteMonthlyBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      });
  },
});

// Export actions and reducer
export const { clearError } = monthlyBudgetSlice.actions;
export default monthlyBudgetSlice.reducer;
