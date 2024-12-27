import React, { createContext, useContext, useState } from 'react';
import { RecipeData } from '../types/auth';

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

interface RecipeContextType {
  recipeData: RecipeData | null;
  isEditing: boolean;  // Your boolean
  searchQuery: string; // Your string
  setRecipeData: (data: RecipeData | null) => void;
  setIsEditing: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <RecipeContext.Provider value={{
      recipeData,
      isEditing,
      searchQuery,
      setRecipeData,
      setIsEditing,
      setSearchQuery
    }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};