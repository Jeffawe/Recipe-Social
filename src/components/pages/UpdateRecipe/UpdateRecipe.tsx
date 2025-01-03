import { useAuth } from '@/components/context/AuthContext';
import { useRecipe } from '@/components/context/RecipeDataContext';
import { RecipeData, RecipeFormData, Image } from '@/components/types/auth';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import RecipeDetailsPage from '../AddRecipe/FirstPage';
import TemplateSelectionPage from '../AddRecipe/SecondPage';
import ErrorToast from '@/components/ErrorToast';
import axios from 'axios';
import { convertToRecipeFormData } from '@/components/helperFunctions/helperFunctions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdateRecipe: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { recipeData, setRecipeData } = useRecipe();
    const { isAuthenticated, user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isToastOpen, setIsToastOpen] = useState(false);
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
        if (!recipe) return;  // Check recipe instead of recipeData
        if (!user) return;

        setIsUploading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            Object.entries(recipe).forEach(([key, value]) => {
                if (key === 'images' && Array.isArray(value)) {
                    value.forEach((image: Image) => {
                        if (image.file) {
                            // New image: append the file for upload
                            formData.append('images', image.file);
                        } else {
                            // Existing image: append its metadata
                            formData.append('existingImages', JSON.stringify({
                                fileName: image.fileName,
                                url: image.url,
                                size: image.size || 0,
                            }));
                        }
                    });
                } else if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            formData.append('templateId', templateId);
            formData.append('templateString', templateString);

            // For updates, use PUT method and include the recipe ID
            const method = id ? 'put' : 'post';
            const url = id
                ? `${API_BASE_URL}/recipes/${id}`
                : `${API_BASE_URL}/recipes`;

            await axios({
                method,
                url,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            localStorage.setItem('recipeStep', '1');
            navigate(`/recipe/${id}`);
        } catch (error: any) {
            setError(error);
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
                    addOrUpdate='Update'
                    goBack={() => navigate(`/recipe/${id}`)}
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
            {error &&
                < ErrorToast
                    message={error}
                    isOpen={isToastOpen}
                    onClose={() => setIsToastOpen(false)}
                    duration={5000}
                />
            }
        </>
    );
};

export default UpdateRecipe 
