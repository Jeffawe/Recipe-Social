import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bookmark, ChefHat } from 'lucide-react';
import { Recipe } from '../types/auth';
import RecipeCard from '../pages/Explore/RecipeCard';

interface MyRecipesProps {
    userId: string;
    isOwnProfile: boolean;
}

const MyRecipes: React.FC<MyRecipesProps> = ({ userId, isOwnProfile }) => {
    const [activeTab, setActiveTab] = useState('created');
    const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([]);
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecipes = async (type: 'created' | 'saved') => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/users/${userId}/recipes/${type}`);
            if (!response.ok) throw new Error(`Failed to fetch ${type} recipes`);
            const data = await response.json();
            if (type === 'created') {
                setCreatedRecipes(data);
            } else {
                setSavedRecipes(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

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
                ) : error ? (
                    <div className="text-center text-red-500 py-8">{error}</div>
                ) : (
                    <>
                        <TabsContent value="created">
                            {createdRecipes.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No recipes created yet</p>
                                    {isOwnProfile && (
                                        <Button className="mt-4">Create Your First Recipe</Button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {createdRecipes.map((recipe) => (
                                        <RecipeCard recipe={recipe} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        {isOwnProfile && (
                            <TabsContent value="saved">
                                {savedRecipes.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No saved recipes yet</p>
                                        <Button variant="secondary" className="mt-4">
                                            Browse Recipes
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedRecipes.map((recipe) => (
                                            <RecipeCard recipe={recipe} />
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