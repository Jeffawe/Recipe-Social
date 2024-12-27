import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useRecipe } from '@/components/context/RecipeDataContext';
import { RecipeData, RecipeFormData, Image } from '@/components/types/auth';

interface Template {
    _id: string;
    name: string;
    description: string;
    preview: string;
    layout: any;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TemplateSelectionPage: React.FC<{
    onBack: () => void;
    onSubmit: (templateId: string) => void;
    recipeData: RecipeFormData;
}> = ({ onBack, onSubmit, recipeData }) => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const { setRecipeData, setIsEditing } = useRecipe();

    React.useEffect(() => {
        fetchTemplates()
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response: any = await axios.get(`${API_BASE_URL}/templates`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
            alert('Failed to load templates. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!selectedTemplate) {
            alert('Please select a template');
            return;
        }
        onSubmit(selectedTemplate);
    };

    const convertToRecipeData = (formData: RecipeFormData): RecipeData => {
        const images: Image[] = formData.images.map(file => ({
          fileName: file.name,
          url: URL.createObjectURL(file),
          size: file.size
        }));
       
        return {
          ...formData,
          images
        };
       };

    const handleCreateTemplate = () => {
        setIsEditing(true)
        const convertedRecipeData = convertToRecipeData(recipeData)
        setRecipeData(convertedRecipeData)
        navigate('/templates')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 relative bg-gradient-to-br from-orange-50 to-white min-h-screen">
            {/* Header section with flex layout */}
            <div className="flex items-center mb-6 gap-4">
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label="Go back"
                >
                    ← Back
                </button>
                <h1 className="text-3xl font-bold text-gray-600">Choose Template</h1>
            </div>

            <div className="mb-6">
                <button
                    onClick={handleCreateTemplate}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                    <Plus size={20} />
                    Create New Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div
                        key={template._id}
                        onClick={() => setSelectedTemplate(template._id)}
                        className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${selectedTemplate === template._id
                                ? 'border-green-500 shadow-lg transform scale-105'
                                : 'border-gray-200 hover:border-green-300'
                            }
                `}
                    >
                        <img
                            src={template.preview}
                            alt={template.name}
                            className="w-full h-48 object-cover rounded mb-4"
                        />
                        <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                        <p className="text-gray-600 text-sm">{template.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={!selectedTemplate}
                    className={`
                px-6 py-3 rounded-lg transition-colors
                ${selectedTemplate
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
              `}
                >
                    Create Recipe
                </button>
            </div>
        </div>
    );
};

export default TemplateSelectionPage

