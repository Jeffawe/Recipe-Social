import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useRecipe } from '@/components/context/RecipeDataContext';
import { RecipeFormData, Template } from '@/components/types/auth';
import BLOCK_COMPONENTS, { BLOCK_TYPES, convertStringToBlockTypes } from '../Templates/ComponentBlocks';
import { useAuth } from '@/components/context/AuthContext';
import { convertToRecipeData } from '@/components/helperFunctions/helperFunctions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface ConvertToPreviewProps {
    blocksString: string;
    data: RecipeFormData;
    className?: string;
}

const TemplateSelectionPage: React.FC<{
    onBack: () => void;
    onSubmit: (templateId: string, templateString: string) => void;
    recipeData: RecipeFormData;
    addOrSubmit: string;
}> = ({ onBack, onSubmit, recipeData, addOrSubmit }) => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template>();
    const [isLoading, setIsLoading] = useState(true);
    const { setRecipeData, setIsEditing } = useRecipe();
    const { user } = useAuth()

    React.useEffect(() => {
        fetchTemplates()
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('token');

            type TemplateResponse = Template[];

            // Fetch both public and user templates concurrently
            const [publicResponse, userResponse] = await Promise.all([
                axios.get<TemplateResponse>(`${API_BASE_URL}/templates/public`, {
                    headers: { Authorization: `Bearer ${token}`, 'api-key': API_KEY }
                }),
                axios.get<TemplateResponse>(`${API_BASE_URL}/templates/user/${user?._id}`, {
                    headers: { Authorization: `Bearer ${token}`, 'api-key': API_KEY }
                })
            ]);

            // Combine and deduplicate templates (in case user's public templates appear in both)
            const allTemplates = [...publicResponse.data, ...userResponse.data];
            const uniqueTemplates = Array.from(new Map(
                allTemplates.map(template => [template._id, template])
            ).values());

            setTemplates(uniqueTemplates);
        } catch (error) {
            //console.error('Error fetching templates:', error);
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

        onSubmit(selectedTemplate._id, selectedTemplate.template);
    };

    const handleCreateTemplate = () => {
        if (!user) return
        setIsEditing(true)
        const convertedRecipeData = convertToRecipeData(recipeData, user!)
        setRecipeData(convertedRecipeData)
        localStorage.setItem('recipeStep', '2');
        navigate('/templates');
    }

    const convertToPreview = ({ blocksString, data, className = '' }: ConvertToPreviewProps) => {
        if (!user) return
        const blockTypes = convertStringToBlockTypes(blocksString)
        const convertedData = convertToRecipeData(data, user!)
        return (
            <div className={`flex flex-col gap-4 ${className}`}>
                {blockTypes.map((block, index) => {
                    const BlockComponent = BLOCK_COMPONENTS[block.type as BLOCK_TYPES]
                    if (!BlockComponent) {
                        return (
                            <div key={index} className="text-gray-500 italic">
                                Unknown Block
                            </div>
                        );
                    }
                    return (
                        <div key={index} className="block-preview p-3 border border-gray-300 rounded-lg shadow-sm bg-white">
                            <div key={index} className={`mb-6 
                                ${block.config?.className?.join(' ') || ''}
                                ${block.config?.maxWidth ? `max-w-${block.config.maxWidth}` : ''}
                                ${block.config?.padding ? `p-${block.config.padding}` : ''}
                                ${block.config?.alignment ? `text-${block.config.alignment}` : ''}`}
                            >
                                <BlockComponent data={convertedData} config={block.config} />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
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
                        onClick={() => setSelectedTemplate(template)}
                        className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${selectedTemplate?._id === template._id
                                ? 'border-orange-500 shadow-lg transform scale-105'
                                : 'border-gray-200 hover:border-orange-300'
                            }
                `}
                    >
                        {/* Call convertToPreview to display a preview of the template */}
                        {convertToPreview({
                            blocksString: template.template, // template.template contains the block types string
                            data: recipeData,                 // recipeData is the data to fill the blocks
                            className: 'max-w-md mx-auto',
                        })}
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
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
              `}
                >
                    {addOrSubmit} Recipe
                </button>
            </div>
        </div>
    );
};

export default TemplateSelectionPage

