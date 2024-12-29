import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useRecipe } from '@/components/context/RecipeDataContext';
import { RecipeData } from '@/components/types/auth';
import BLOCK_COMPONENTS, { BLOCK_TYPES, convertStringToBlockTypes } from '../Templates/ComponentBlocks';
import { useAuth } from '@/components/context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecipePage : React.FC = () => {
  const { id } = useParams();
  const { recipeData } = useRecipe();
  const { isAuthenticated } = useAuth()
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [template, setTemplate] = useState<BLOCK_TYPES[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipeData = async () => {
    try {
      // If recipeData is already available, use it directly
      if (recipeData?.templateString) {
        setRecipe(recipeData);
        const blockTypes = convertStringToBlockTypes(recipeData.templateString);
        setTemplate(blockTypes);
        return;
      }
  
      // Check the loggedIn state to decide whether to include the Authorization header
      const headers = isAuthenticated
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : undefined;
  
      // Fetch recipe data from the API
      const { data: recipeResponse } = await axios.get<RecipeData>(
        `${API_BASE_URL}/recipes/${id}`,
        { headers }
      );
  
      if (!recipeResponse.templateString) {
        throw new Error('Template string is missing in the recipe data.');
      }
  
      // Process the recipe data
      setRecipe(recipeResponse);
      const blockTypes = convertStringToBlockTypes(recipeResponse.templateString);
      setTemplate(blockTypes);
    } catch (error) {
      // Handle errors (e.g., 404 or network issues)
      console.error('Error fetching recipe:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecipeData();
  }, [id, recipeData]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading recipe: {error}
      </div>
    );
  }

  if (!recipe) {
    return <div className="flex justify-center items-center min-h-screen">Recipe not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {template.map((blockType, index) => {
            const Component = BLOCK_COMPONENTS[blockType];
            return (
              <div key={index} className="mb-6">
                <Component data={recipe} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecipePage;