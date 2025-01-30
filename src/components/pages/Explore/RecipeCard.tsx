import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/context/AuthContext';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import type { RecipeData, User } from '../../types/auth.js';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Heart, ChefHat } from 'lucide-react';

interface RecipeCardProps {
    recipe: RecipeData;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const navigate = useNavigate();
    const { user, isAuthenticated, setUser } = useAuth();
    const [isLiked, setIsLiked] = useState(recipe.likes?.includes(user?._id || ''));
    const [likesCount, setLikesCount] = useState(recipe.likes?.length || 0);
    const [isSaved, setIsSaved] = useState(user?.savedRecipes.includes(recipe._id || ''));

    const {
        _id,
        title = "Untitled Recipe",
        description = "No description available",
        images = [],
        category = "Uncategorized",
        cookingTime = { prep: 0, cook: 0 },
    } = recipe;

    const totalTime = (cookingTime?.prep || 0) + (cookingTime?.cook || 0);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            return;
        }

        try {
            const response: any = await axios.post(
                `${API_BASE_URL}/recipes/${_id}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'api-key': API_KEY
                    }
                }
            );

            if (response.data.success) {
                setIsLiked(response.data.isLiked);
                setLikesCount(response.data.likes);
            }
        } catch (error) {
            //console.error('Error liking recipe:', error);
        }
    };

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            return;
        }

        try {
            const response: any = await axios.post(
                `${API_BASE_URL}/recipes/${_id}/save`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'api-key': API_KEY
                    }
                }
            );

            if (response.data.success) {
                if (recipe?._id && user) {
                    const updatedUser: User = {
                        ...user,
                        savedRecipes: [...(user?.savedRecipes || []), recipe._id]
                    };
                    setUser(updatedUser);
                }
                setIsSaved(response.data.isSaved);
            }
        } catch (error) {
            //console.error('Error saving recipe:', error);
        }
    };

    const navigateToRecipe = () => {
        if(recipe.external){
            navigate(`/recipe/external-${_id}`)
        }else{
            navigate(`/recipe/${_id}`)
        }
    }

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={navigateToRecipe}
        >
            <CardHeader className="p-0">
                {images[0]?.url ? (
                    <img
                        src={images[0]?.url}
                        alt={title}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex flex-col items-center justify-center p-4">
                        <div className="mb-2">
                            <ChefHat className="text-orange-500 w-12 h-12" />
                        </div>
                        <span className="text-lg font-semibold text-gray-800">Recipe Social Recipe</span>
                    </div>

                )}
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg truncate">{title}</CardTitle>
                    <Badge variant="secondary">{category}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                            {totalTime} mins
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {!recipe.external &&
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-1"
                                title={isAuthenticated ? 'Like recipe' : 'Login to like recipe'}
                            >
                                <Heart
                                    className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
                                />
                                <span className="text-sm text-gray-600">{likesCount}</span>
                            </button>
                        }
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1"
                            title={isAuthenticated ? 'Save recipe' : 'Login to save recipe'}
                        >
                            <Star
                                className={`w-4 h-4 ${isSaved ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'} hover:text-yellow-500 transition-colors`}
                            />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecipeCard;