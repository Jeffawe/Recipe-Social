import React from 'react';
import { PlusCircle, BookOpen, ChefHat, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  const handleAddRecipe = () => {
    localStorage.setItem('recipeStep', '1');
    navigate('/add-recipe');
  };

  if (isLoading) {
    return (
      <div className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side skeleton */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-40" />
            </div>

            {/* Right side skeleton */}
            <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="py-20 bg-gradient-to-br from-orange-50 to-white flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md w-full space-y-4">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-gray-600 mb-8">
              Ready to share your culinary creations or discover new recipes?
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddRecipe}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <PlusCircle className="mr-2" />
              Add New Recipe
            </button>

            <button
              onClick={() => navigate('/explore')}
              className="w-full bg-white border-2 border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2"
            >
              <BookOpen className="mr-2" />
              Explore Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <ChefHat className="text-orange-500" size={40} />
              <h1 className="text-4xl font-bold text-gray-900">
                RecipeSocial
              </h1>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Share Your Culinary Journey
            </h2>
            <p className="text-xl text-gray-600">
              Join our community of food lovers. Share recipes, discover new dishes,
              and connect with passionate chefs from around the world.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => navigate('/explore')}
              >
                Start Exploring
              </Button>
            </div>
          </div>

          {/* Right side - Feature highlights */}
          <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Why Join RecipeSocial?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <PlusCircle className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Share Your Recipes</h4>
                    <p className="text-gray-600">Upload and share your favorite recipes with our growing community</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Discover New Dishes</h4>
                    <p className="text-gray-600">Explore a vast collection of recipes from around the world</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Heart className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Build Your Collection</h4>
                    <p className="text-gray-600">Save your favorite recipes and create your personal cookbook</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;