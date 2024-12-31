import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecipeDetailsPage from './FirstPage';
import TemplateSelectionPage from './SecondPage';
import { convertToRecipeData, RecipeFormData } from '@/components/types/auth';
import { useRecipe } from '@/components/context/RecipeDataContext';
import { useAuth } from '@/components/context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(() => {
    return Number(localStorage.getItem('recipeStep')) || 1;
  });
  const [recipeData, setrecipeData] = useState<RecipeFormData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { setRecipeData } = useRecipe();
  const { user } = useAuth()

  const handleFirstStepComplete = (data: RecipeFormData) => {
    setrecipeData(data);
    localStorage.setItem('recipeStep', '2');
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    localStorage.setItem('recipeStep', '1');
  };

  const handleFinalSubmit = async (templateId: string, templateString: string) => {
    if (!recipeData) return;
    if (!user) return;
  
    const finalData = convertToRecipeData(recipeData, user!);
    finalData.templateString = templateString;
    setRecipeData(finalData);
    console.log(templateString)
  
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
  
      // Use finalData instead of recipeData
      Object.entries(recipeData).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((image: File) => {
            formData.append('images', image);
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
        },
      });
  
      localStorage.setItem('recipeStep', '1');
      navigate(`/recipe/${response.data._id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  

  return (
    <>
      {step === 1 && (
        <RecipeDetailsPage
          onNext={handleFirstStepComplete}
          initialData={recipeData || undefined}
        />
      )}
      {step === 2 && recipeData && (
        <TemplateSelectionPage
          onBack={handleBack}
          onSubmit={handleFinalSubmit}
          recipeData={recipeData}
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
    </>
  );
};


export default AddRecipe;