import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the Recipe type based on your Mongoose schema
export interface Ingredient {
  name: string;
  quantity: string;
  unit: 'cup' | 'tablespoon' | 'teaspoon' | 'gram' | 'kg' | 'ml' | 'piece' | 'slice';
}

export interface RecipeDirection {
  step: number;
  instruction: string;
}

export interface RecipeImage {
  url: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  directions: RecipeDirection[];
  images: RecipeImage[];
  cookingTime?: {
    prep?: number;
    cook?: number;
  };
  nutrition?: {
    servings?: number;
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
  };
  category?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Snack' | 'Appetizer' | 'Beverage';
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the state type
export interface RecipeDetailState {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

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
      const response = await axios.get(`/api/routes/${recipeId}`);
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