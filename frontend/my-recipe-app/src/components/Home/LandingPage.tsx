import React from 'react';
import { PlusCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage : React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-md w-full space-y-4">
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                Welcome, Chef!
              </h2>
              <p className="text-gray-600 mb-8">
                Ready to share your culinary creations or discover new recipes?
              </p>
            </div>
    
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/add-recipe')}
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

export default LandingPage
