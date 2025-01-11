import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecipeDetailsPage from './FirstPage';
import TemplateSelectionPage from './SecondPage';
import { RecipeFormData, Image, RecipeData } from '@/components/types/auth';
import { useRecipe } from '@/components/context/RecipeDataContext';
import { useAuth } from '@/components/context/AuthContext';
import ErrorToast from '@/components/ErrorToast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MAX_RECIPE_LIMIT = import.meta.env.VITE_MAX_RECIPES || 5;
const API_KEY = import.meta.env.VITE_API_KEY;

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(() => {
    return Number(localStorage.getItem('recipeStep')) || 1;
  });
  const [recipeData, setrecipeData] = useState<RecipeFormData | null>(() => {
    const savedData = localStorage.getItem('recipeData');
    return savedData ? JSON.parse(savedData) : null;
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const { setRecipeData } = useRecipe();
  const { user } = useAuth()

  const handleFirstStepComplete = (data: RecipeFormData) => {
    setrecipeData(data);
    localStorage.setItem('recipeData', JSON.stringify(data));
    localStorage.setItem('recipeStep', '2');
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    localStorage.setItem('recipeStep', '1');
  };

  const handleFinalSubmit = async (templateId: string, templateString: string) => {
    if (!recipeData || !user) {
      throw new Error('Recipe data or user information is missing.');
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }
      const formData = new FormData();

      Object.entries(recipeData).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((image: Image) => {
            formData.append('images', image.file!); // Use the `file` property
          });
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value)); // Ensure non-object values are strings
        }
      });

      // Append templateId and templateString
      formData.append('templateId', templateId);
      formData.append('templateString', templateString);

      const response: any = await axios.post(`${API_BASE_URL}/recipes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          'api-key': API_KEY
        },
      });

      const createdRecipe: RecipeData = response.data;

      setRecipeData(createdRecipe);

      localStorage.removeItem('recipeStep');
      localStorage.removeItem('recipeData');
      navigate(`/recipe/${response.data._id}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'An unexpected error occurred');
      }
      setIsToastOpen(true)
    } finally {
      setIsUploading(false);
    }
  };

  if(!user){
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="text-center bg-white p-6 rounded-lg shadow-lg w-4/5 sm:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            You're not a User.
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Don't know how you got here but you're not allowed to be here.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Let's Head Back
          </button>
        </div>
      </div>
    );
  }

  if (!user?.createdRecipes || user?.createdRecipes.length >= MAX_RECIPE_LIMIT) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="text-center bg-white p-6 rounded-lg shadow-lg w-4/5 sm:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            You can't create more recipes at the moment.
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Due to database cost limits, we are currently unable to allow more recipes to be added to the system on the free plan.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Explore recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {step === 1 && (
        <RecipeDetailsPage
          onNext={handleFirstStepComplete}
          initialData={recipeData || undefined}
          addOrUpdate='Add'
          goBack={() => navigate('/')}
        />
      )}
      {step === 2 && recipeData && (
        <TemplateSelectionPage
          onBack={handleBack}
          onSubmit={handleFinalSubmit}
          recipeData={recipeData}
          addOrSubmit='Create'
        />
      )}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Creating Recipe...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we save your recipe</p>
          </div>
        </div>
      )}
      {error &&
        <ErrorToast
          message={error}
          isOpen={isToastOpen}
          onClose={() => setIsToastOpen(false)}
          duration={5000}
        />
      }
    </>
  );
};


export default AddRecipe;