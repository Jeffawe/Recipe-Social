import { useAuth } from '@/components/context/AuthContext';
import { useRecipe } from '@/components/context/RecipeDataContext';
import { convertToRecipeFormData, RecipeData, RecipeFormData } from '@/components/types/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import RecipeDetailsPage from '../AddRecipe/FirstPage';
import TemplateSelectionPage from '../AddRecipe/SecondPage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdateRecipe: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { recipeData, setRecipeData } = useRecipe();
    const { isAuthenticated, user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(() => {
        return Number(localStorage.getItem('recipeStep')) || 1;
    });
    const [recipe, setRecipe] = useState<RecipeFormData | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFirstStepComplete = (data: RecipeFormData) => {
        setRecipe(data);
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

    const fetchRecipeData = async () => {
        try {
            // If recipeData is already available, use it directly
            if (recipeData) {
                const data = await convertToRecipeFormData(recipeData)
                setRecipe(data)
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

            setRecipeData(recipeResponse);
            const data = await convertToRecipeFormData(recipeResponse)
            setRecipe(data)

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

    return (
        <>
            {step === 1 && (
                <RecipeDetailsPage
                    onNext={handleFirstStepComplete}
                    initialData={recipe || undefined}
                />
            )}
            {step === 2 && recipeData && (
                <TemplateSelectionPage
                    onBack={handleBack}
                    onSubmit={handleFinalSubmit}
                    recipeData={recipe!}
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

export default UpdateRecipe 
