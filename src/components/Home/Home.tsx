import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage'
import SearchBar from './SearchBar';
import Explore from '../pages/Explore/Explore';
import { PlusIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import BetaNoticeModal from '../Beta/BetaNoticeModal';

const Home: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleAddRecipe = () => {
    localStorage.setItem('recipeStep', '1');
    navigate('/add-recipe');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-orange-50 to-white">
        <div className="w-full px-0 flex-grow">
          {/* Skeleton for the main content */}
          <div className="py-20 px-4">
            <div className="container mx-auto">
              <div className="space-y-4 max-w-3xl mx-auto">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>

          {/* Skeleton for SearchBar */}
          <div className="px-4">
            <Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-lg" />
          </div>

          {/* Skeleton for minimal Explore */}
          <div className="mt-8 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-orange-50 to-white">
      <BetaNoticeModal />
      <div className="w-full px-0 flex-grow">
        <LandingPage />
        {isAuthenticated && <SearchBar />}
        {isAuthenticated &&
          <Explore isMinimal={true} />
        }
      </div>

      {isAuthenticated &&
        <button
          onClick={handleAddRecipe}
          className="fixed bottom-6 right-6 bg-orange-500 text-white 
        rounded-full w-16 h-16 flex items-center justify-center 
        shadow-lg hover:bg-orange-600 transition-colors z-50"
        >
          <PlusIcon size={32} />
        </button>
      }
    </div>
  );
};

export default Home;