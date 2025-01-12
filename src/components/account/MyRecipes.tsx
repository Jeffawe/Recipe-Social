import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bookmark, ChefHat } from 'lucide-react';
import { RecipeData } from '../types/auth';
import RecipeCard from '../pages/Explore/RecipeCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface MyRecipesProps {
    userId: string;
    isOwnProfile: boolean;
}

const MyRecipes: React.FC<MyRecipesProps> = ({ userId, isOwnProfile }) => {
    const [activeTab, setActiveTab] = useState<'created' | 'saved'>('created');
    const [createdRecipes, setCreatedRecipes] = useState<RecipeData[]>([]);
    const [savedRecipes, setSavedRecipes] = useState<RecipeData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchRecipes = async (type: 'created' | 'saved') => {
        try {
            setIsLoading(true);
            if(type == null) type = activeTab
            const response:any = await axios.get(`${API_BASE_URL}/auth/${userId}/recipes/${type}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'api-key': API_KEY,
                }
            });

            const data = response.data;
            if (type === 'created') {
                setCreatedRecipes(
                    data.map((item: RecipeData) => ({
                        _id: item._id,
                        title: item.title,
                        description: item.description || "", // Provide a default value if missing
                        ingredients: item.ingredients || [], // Ensure this is an empty array if not provided
                        directions: item.directions || [],   // Ensure this is an empty array if not provided
                        images: item.images || [],           // Ensure this is an empty array if not provided
                        cookingTime: item.cookingTime || { prep: 0, cook: 0 }, // Default cookingTime if missing
                        nutrition: item.nutrition || null,   // Optional field can default to null
                        category: item.category || null,     // Optional field can default to null
                        comments: item.comments || [],       // Default to an empty array
                        faqs: item.faqs || [],               // Default to an empty array
                        likes: item.likes || [],             // Default to an empty array
                        featured: item.featured || false,    // Default to false
                        latest: item.latest || false,        // Default to false
                        popular: item.popular || false,      // Default to false
                        templateID: item.templateID || null, // Default to null
                        templateString: item.templateString || "", // Default to an empty string
                        author: item.author || {             // Default author object if missing
                            _id: "",
                            username: "Unknown",
                            email: "",
                        },
                        createdAt: item.createdAt || new Date().toISOString(),
                        updatedAt: item.updatedAt || new Date().toISOString(),
                    }))
                );
            } else {
                setSavedRecipes(
                    data.map((item: RecipeData) => ({
                        _id: item._id,
                        title: item.title,
                        description: item.description || "", // Provide a default value if missing
                        ingredients: item.ingredients || [], // Ensure this is an empty array if not provided
                        directions: item.directions || [],   // Ensure this is an empty array if not provided
                        images: item.images || [],           // Ensure this is an empty array if not provided
                        cookingTime: item.cookingTime || { prep: 0, cook: 0 }, // Default cookingTime if missing
                        nutrition: item.nutrition || null,   // Optional field can default to null
                        category: item.category || null,     // Optional field can default to null
                        comments: item.comments || [],       // Default to an empty array
                        faqs: item.faqs || [],               // Default to an empty array
                        likes: item.likes || [],             // Default to an empty array
                        featured: item.featured || false,    // Default to false
                        latest: item.latest || false,        // Default to false
                        popular: item.popular || false,      // Default to false
                        templateID: item.templateID || null, // Default to null
                        templateString: item.templateString || "", // Default to an empty string
                        author: item.author || {             // Default author object if missing
                            _id: "",
                            username: "Unknown",
                            email: "",
                        },
                        createdAt: item.createdAt || new Date().toISOString(),
                        updatedAt: item.updatedAt || new Date().toISOString(),
                    }))
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddRecipe = () => {
        navigate('/add-recipe')
    }

    const handleBrowseRecipe = () => {
        navigate('/explore');
    }

    useEffect(() => {
        fetchRecipes('created');
        if (isOwnProfile) {
            fetchRecipes('saved');
        }
    }, [userId, isOwnProfile]);

    return (
        <div>
            <Tabs defaultValue="created" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
                    <TabsTrigger
                        value="created"
                        className="flex items-center gap-2"
                        onClick={() => setActiveTab('created')}
                    >
                        <ChefHat className="h-4 w-4" />
                        Created Recipes
                    </TabsTrigger>
                    {isOwnProfile && (
                        <TabsTrigger
                            value="saved"
                            className="flex items-center gap-2"
                            onClick={() => setActiveTab('saved')}
                        >
                            <Bookmark className="h-4 w-4" />
                            Saved Recipes
                        </TabsTrigger>
                    )}
                </TabsList>

                {isLoading ? (
                    <div className="text-center py-8">Loading recipes...</div>
                ) : (
                    <>
                        <TabsContent value="created">
                            {createdRecipes.length === 0 || error ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No recipes created yet</p>
                                    {isOwnProfile && (
                                        <Button className="mt-4 bg-orange-500 hover:bg-orange-700" onClick={handleAddRecipe}>Create Your First Recipe</Button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {createdRecipes.map((recipe) => (
                                        <RecipeCard key={recipe._id} recipe={recipe} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {isOwnProfile && (
                            <TabsContent value="saved">
                                {savedRecipes.length === 0 || error ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No saved recipes yet</p>
                                        <Button onClick={handleBrowseRecipe} variant="secondary" className="bg-orange-500 hover:bg-orange-700 text-white mt-4">
                                            Browse Recipes
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedRecipes.map((recipe) => (
                                            <RecipeCard key={recipe._id} recipe={recipe} />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        )}
                    </>
                )}
            </Tabs>
        </div>
    );
};

export default MyRecipes;