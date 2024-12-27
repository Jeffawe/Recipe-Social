import { Recipe, RecipeDetailState } from '@/components/types/auth';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the Recipe type based on your Mongoose schema

// Initial state
const initialState: RecipeDetailState = {
  recipe: null,
  loading: false,
  error: null
};

export const fetchRecipeDetails = createAsyncThunk<
  Recipe,              // Return type
  string,              // Argument type (recipeId)
  { rejectValue: string } // ThunkAPI configuration
>(
  'recipes/fetchRecipeDetails',
  async (recipeId, { rejectWithValue }) => {
    try {
      // Make an API call to fetch recipe details
      const response = await axios.get(`${API_BASE_URL}/api/routes/${recipeId}`);
      return response.data as Recipe; // Ensure response type safety
    } catch (error: any) {
      // Handle error and provide a fallback message
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recipe'
      );
    }
  }
);

// Create the slice
const recipeDetailSlice = createSlice({
  name: 'recipeDetail',
  initialState,
  reducers: {
    clearRecipeDetail: (state) => {
      state.recipe = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeDetails.fulfilled, (state:RecipeDetailState, action:any) => {
        state.loading = false;
        state.recipe = action.payload;
      })
      .addCase(fetchRecipeDetails.rejected, (state:RecipeDetailState, action:any) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch recipe';
      });
  }
});

// Export actions and reducer
export const { clearRecipeDetail } = recipeDetailSlice.actions;
export default recipeDetailSlice.reducer;