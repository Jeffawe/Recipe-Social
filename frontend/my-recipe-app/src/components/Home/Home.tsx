import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage'
import SearchBar from './SearchBar';
import Explore from '../pages/Explore/Explore';
import { PlusIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddRecipe = () => {
    navigate('/add-recipe');
  };

  return (
    <div className="min-h-screen flex flex-col relative  bg-gradient-to-br from-orange-50 to-white">
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