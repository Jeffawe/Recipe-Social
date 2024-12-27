import { configureStore } from '@reduxjs/toolkit';
import recipeDetailReducer from './RecipeShowcasePage/recipeDetailSlice'; // Your slice reducer
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Create the Redux store
export const store = configureStore({
  reducer: {
    recipeDetail: recipeDetailReducer, // Register your reducer here
  },
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;