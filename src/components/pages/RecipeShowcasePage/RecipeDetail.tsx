import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useRecipe } from '@/components/context/RecipeDataContext';
import { RecipeData, RecipesScrapeResponse } from '@/components/types/auth';
import BLOCK_COMPONENTS, { BLOCK_TYPES, convertStringToBlockTypes, Block } from '../Templates/ComponentBlocks';
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
import CommentAndFAQTabs from './CommentAndFAQTab';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const DEFAULT_TEMPLATE = import.meta.env.VITE_DEFAULT_TEMPLATE;
const DEFAULT_TEMPLATE_EXTERNAL = import.meta.env.VITE_DEFAULT_TEMPLATE_EXTERNAL;

const RecipePage: React.FC = () => {
  const { originalId } = useParams<{ originalId?: string }>();

  const id = originalId?.startsWith("external-")
    ? originalId.replace("external-", "")
    : originalId || "";

  const { recipeData, setRecipeData } = useRecipe();
  const { isAuthenticated, user } = useAuth();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [template, setTemplate] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate()

  const fetchScrapedData = async () => {
    try {
      const { data: recipeResponse } = await axios.post<RecipesScrapeResponse>(
        `${API_BASE_URL}/scrape`,
        {
          search_data: {
            title: `${localStorage.getItem('searchValue')}`
          },
          threshold: 0.3
        },
        {
          headers: {
            'api-key': API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      if (recipeResponse?.success) {
        const recipe = recipeResponse.data?.find(recipe => recipe._id === id);
        if (!recipe) {
          throw new Error("Can't find Recipe");
        }
        setRecipe(recipe);

        // Default template assignment
        setTemplate(convertStringToBlockTypes(DEFAULT_TEMPLATE_EXTERNAL));
      } else {
        throw new Error('Scrape API call failed or returned invalid data');
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchRecipeData = async () => {
    try {
      // Handle external recipes
      if (originalId?.includes("external-")) {
        const recipe = getRecipeById(id);
        if (recipe) {
          setRecipe(recipe);
          setTemplate(convertStringToBlockTypes(DEFAULT_TEMPLATE_EXTERNAL));
          return;
        } else {
          await fetchScrapedData();
          return;
        }
      }
      // Use recipeData if available
      if (recipeData?.templateString) {
        setRecipe(recipeData);
        setRecipeData(null);
        setTemplate(convertStringToBlockTypes(recipeData.templateString));
        return;
      }

      // Fetch recipe from API
      const headers = isAuthenticated && localStorage.getItem('token')
        ? {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'api-key': API_KEY,
        }
        : { 'api-key': API_KEY };

      const { data: recipeResponse } = await axios.get<RecipeData>(
        `${API_BASE_URL}/recipes/${id}`,
        { headers }
      );

      setRecipe(recipeResponse);

      const templateString = recipeResponse.templateString || DEFAULT_TEMPLATE;
      setTemplate(convertStringToBlockTypes(templateString));
    } catch (error) {
      // Navigate on error
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      const searchTerm = localStorage.getItem('searchValue')
      if (searchTerm && searchTerm.trim()) {
        navigate(`/explore?search=${encodeURIComponent(searchTerm)}`);
      } else {
        navigate('/explore');
      }

    } finally {
      setIsLoading(false)
    }
  };

  const getRecipeById = (id: string) => {
    if (!id) return null;

    const storedRecipes = localStorage.getItem('externalRecipes');
    if (!storedRecipes) return null;

    try {
      const recipes: RecipeData[] = JSON.parse(storedRecipes);
      return recipes.find(recipe => recipe._id === id) || null;
    } catch (error) {
      //console.error('Error parsing externalRecipes from localStorage:', error);
      return null;
    }
  };

  const handleClick = async (recipe:RecipeData) => {
    window.open(recipe.pageURL, '_blank')
    alert("Help us improve our ML model!");
    const isRecipe = confirm("Was this a recipe page?");
    
    if (isRecipe !== null) {
      console.log("Wonderful. Thanks for the Reply")
    }
  }

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
                    setRecipeData(recipe)
                    localStorage.setItem('recipeStep', '1');
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

        {template.map((block, index) => {
          const Component = BLOCK_COMPONENTS[block.type as BLOCK_TYPES];
          return (
            <div key={index} className={`mb-6 
                ${block.config?.className?.join(' ') || ''}
                ${block.config?.maxWidth ? `max-w-${block.config.maxWidth}` : ''}
                ${block.config?.padding ? `p-${block.config.padding}` : ''}
                ${block.config?.alignment ? `text-${block.config.alignment}` : ''}`}
            >
              <Component data={recipe} config={block.config} />
            </div>
          );
        })}

        {recipe?.external &&
          <div className="flex items-center justify-center">
            <button onClick={() => handleClick(recipe) } className="bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-orange-400 hover:to-red-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all">
              Visit Page
            </button>
          </div>
        }

        {!recipe.external &&
          <CommentAndFAQTabs recipeId={recipe._id} recipe={recipe} />
        }

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