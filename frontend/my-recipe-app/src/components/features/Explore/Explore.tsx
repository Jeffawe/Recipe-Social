// components/ExploreRecipes.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Filter, Star, Loader2 } from 'lucide-react';
import type { Recipe, FilterState, RecipesResponse } from '../../types/auth.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ExploreRecipesProps {
  isMinimal?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
}

const Explore: React.FC<ExploreRecipesProps> = ({ isMinimal = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    cookingTime: 120,
    difficulty: 'all',
    page: 1,
    limit: 10
  });

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.categories.length && { category: filters.categories[0] })
      });

      const response = await axios.get<RecipesResponse>(
        `${API_BASE_URL}/recipes?${params.toString()}`
      );

      setRecipes(response.data.recipes);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
    } catch (err) {
      setError('Failed to fetch recipes');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [filters.page, filters.categories]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      <CardHeader className="p-0">
        <img 
          src={recipe.images[0]?.url || '/placeholder-recipe.jpg'} 
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">{recipe.title}</CardTitle>
          <Badge variant="secondary">{recipe.category}</Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{recipe.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {recipe.cookingTime.prep + recipe.cookingTime.cook} mins
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">{recipe.likes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FilterSidebar = () => (
    <Card className="p-4">
      <CardTitle className="mb-4">Filters</CardTitle>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Beverage'].map(
              category => (
                <Badge
                  key={category}
                  variant={filters.categories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    categories: [category]
                  }))}
                >
                  {category}
                </Badge>
              )
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Maximum Cooking Time</h3>
          <Slider
            value={[filters.cookingTime]}
            onValueChange={([value]) => setFilters(prev => ({
              ...prev,
              cookingTime: value
            }))}
            max={180}
            step={15}
          />
          <span className="text-sm text-gray-600">{filters.cookingTime} minutes</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className={`w-full ${isMinimal ? 'max-w-3xl' : 'max-w-7xl'} mx-auto p-4`}>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all">All Recipes</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="latest">Latest</TabsTrigger>
          </TabsList>

          {isMinimal && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Recipes</SheetTitle>
                </SheetHeader>
                <FilterSidebar />
              </SheetContent>
            </Sheet>
          )}
        </div>

        <div className="flex gap-6">
          {!isMinimal && (
            <div className="w-64 shrink-0">
              <FilterSidebar />
            </div>
          )}

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recipes.map(recipe => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>
                
                {recipes.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    No recipes found matching your criteria
                  </div>
                )}

                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      disabled={pagination.currentPage === 1}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        page: prev.page - 1 
                      }))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        page: prev.page + 1 
                      }))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Explore;