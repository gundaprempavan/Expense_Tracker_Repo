// src/redux/categoryBudgetSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions

// Add a new category-wise budget
export const addCategoryBudget = createAsyncThunk(
  "categoryBudget/add",
  async (budgetData) => {
    const response = await axios.post(
      "http://localhost:5000/api/categorywise-budget/add",
      budgetData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Include token for authentication
        },
      }
    );
    return response.data.categoryBudget; // Returning the created category budget
  }
);

// Get all category-wise budgets for a user
export const fetchUserCategoryBudgets = createAsyncThunk(
  "categoryBudget/fetchAll",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/categorywise-budget",
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Returning the list of category budgets
  }
);

// Get a single category-wise budget by ID
export const fetchCategoryBudgetById = createAsyncThunk(
  "categoryBudget/fetchById",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/categorywise-budget/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data; // Returning the category budget details
  }
);

// Update an existing category-wise budget
export const updateCategoryBudget = createAsyncThunk(
  "categoryBudget/update",
  async ({ id, budgetData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/categorywise-budget/update/${id}`,
      budgetData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data.categoryBudget; // Returning the updated category budget
  }
);

// Delete a category-wise budget
export const deleteCategoryBudget = createAsyncThunk(
  "categoryBudget/delete",
  async (id) => {
    await axios.delete(
      `http://localhost:5000/api/categorywise-budget/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return id; // Returning the id of the deleted category budget
  }
);

// Category Budget slice
const categoryBudgetSlice = createSlice({
  name: "categoryBudget",
  initialState: {
    budgets: [],
    selectedBudget: null, // New property to hold the selected category budget
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
      .addCase(addCategoryBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategoryBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets.push(action.payload); // Add the new category budget to the state
      })
      .addCase(addCategoryBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(fetchUserCategoryBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCategoryBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload; // Set the fetched category budgets
      })
      .addCase(fetchUserCategoryBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(fetchCategoryBudgetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBudgetById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBudget = action.payload; // Store the fetched category budget in the state
      })
      .addCase(fetchCategoryBudgetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(updateCategoryBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryBudget.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.budgets.findIndex(
          (budget) => budget.id === action.payload.id
        );
        if (index !== -1) {
          state.budgets[index] = action.payload; // Update the category budget in the state
        }
      })
      .addCase(updateCategoryBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(deleteCategoryBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = state.budgets.filter(
          (budget) => budget.id !== action.payload
        ); // Remove the deleted category budget from the state
      })
      .addCase(deleteCategoryBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      });
  },
});

// Export actions and reducer
export const { clearError } = categoryBudgetSlice.actions;
export default categoryBudgetSlice.reducer;
