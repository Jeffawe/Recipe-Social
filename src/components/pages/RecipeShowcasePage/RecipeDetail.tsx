import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useRecipe } from '@/components/context/RecipeDataContext';
import { RecipeData } from '@/components/types/auth';
import BLOCK_COMPONENTS, { BLOCK_TYPES, convertStringToBlockTypes } from '../Templates/ComponentBlocks';
import { useAuth } from '@/components/context/AuthContext';
import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteRecipeModal from './DeleteRecipeModal';
import { ReportRecipeModal } from './ReportRecipeModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_TEMPLATE = import.meta.env.VITE_DEFAULT_TEMPLATE;

const RecipePage: React.FC = () => {
  const { id } = useParams();
  const { recipeData, setRecipeData } = useRecipe();
  const { isAuthenticated, user } = useAuth();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [template, setTemplate] = useState<BLOCK_TYPES[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate()

  const fetchRecipeData = async () => {
    try {
      // If recipeData is already available, use it directly
      if (recipeData?.templateString) {
        setRecipe(recipeData);
        setRecipeData(null)
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
        setRecipe(recipeResponse);
        const blockTypes2 = convertStringToBlockTypes(DEFAULT_TEMPLATE);
        setTemplate(blockTypes2);
      } else {
        setRecipe(recipeResponse);
        const blockTypes = convertStringToBlockTypes(recipeResponse.templateString!);
        setTemplate(blockTypes);
      }
    } catch (error) {
      // Handle errors (e.g., 404 or network issues)
      console.error('Error fetching recipe:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      console.log(recipe?.author._id)
      console.log(user?._id)
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/recipes/${recipe?._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/');
    } catch (err) {
      setError('Failed to delete recipe');
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-end mb-4">
          <DropdownMenu
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <DropdownMenuTrigger
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
              aria-label="Recipe options"
            >
              <Settings className="h-6 w-6 text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(event) => {
                event.preventDefault();
              }}
            >
              <DropdownMenuItem onClick={() => {
                setIsOpen(false);
                setIsReportModalOpen(true);
              }}>
                Report Recipe
              </DropdownMenuItem>
              {isAuthenticated && recipe?.author._id === user?._id && (
                <>
                  <DropdownMenuItem onClick={() => {
                    setIsOpen(false);
                    navigate(`/update-recipe/${id}`);
                  }}>
                    Update Recipe
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setIsOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600"
                  >
                    Delete Recipe
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {template.map((blockType, index) => {
          const Component = BLOCK_COMPONENTS[blockType];
          return (
            <div key={index} className="mb-6">
              <Component data={recipe} />
            </div>
          );
        })}

        <DeleteRecipeModal
          isOpen={isDeleteModalOpen}
          deleteAction={handleDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />

        <ReportRecipeModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          recipeId={recipe._id}
        />
      </div>
    </div>
  );
};

export default RecipePage;