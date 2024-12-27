import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import type { Recipe } from '../../types/auth.js';
import { Badge } from '@/components/ui/badge';
import { Clock, Star } from 'lucide-react';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const navigate = useNavigate();

    const {
        _id,
        title = "Untitled Recipe",
        description = "No description available",
        images = [],
        category = "Uncategorized",
        cookingTime = { prep: 0, cook: 0 },
        likes = []
    } = recipe;

    // Calculate total time with fallback
    const totalTime = (cookingTime?.prep || 0) + (cookingTime?.cook || 0);

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/recipe/${_id}`)}
        >
            <CardHeader className="p-0">
                <img
                    src={images[0]?.url || '/placeholder-recipe.jpg'}
                    alt={title}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{title}</CardTitle>
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
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{likes.length}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecipeCard;