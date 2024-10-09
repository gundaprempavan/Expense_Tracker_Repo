import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions

// Add a new category
export const addCategory = createAsyncThunk(
  "category/add",
  async (categoryData) => {
    const response = await axios.post(
      "http://localhost:5000/api/category/add",
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Include token for authentication
        },
      }
    );
    return response.data.category; // Returning the created category
  }
);

// Get all categories for a user
export const fetchUserCategories = createAsyncThunk(
  "category/fetchAll",
  async () => {
    const response = await axios.get("http://localhost:5000/api/category", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data; // Returning the list of categories
  }
);

// Update an existing category
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, categoryData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/category/update/${id}`,
      categoryData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data.category; // Returning the updated category
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id) => {
    await axios.delete(`http://localhost:5000/api/category/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return id; // Returning the id of the deleted category
  }
);

// Category slice
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
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
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload); // Add the new category to the state
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(fetchUserCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; // Set the fetched categories
      })
      .addCase(fetchUserCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload; // Update the category in the state
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload
        ); // Remove the deleted category from the state
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Handle error
      });
  },
});

// Export actions and reducer
export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
