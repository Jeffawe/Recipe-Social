import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage'
import SearchBar from './SearchBar';
import Explore from '../features/Explore/Explore';
import { PlusIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddRecipe = () => {
    navigate('/add-recipe');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="w-full px-0 flex-grow">
        <LandingPage />
        <SearchBar />
        {isAuthenticated &&
          <Explore />
        }
      </div>

      {isAuthenticated &&
        <button
          onClick={handleAddRecipe}
          className="fixed bottom-6 right-6 bg-blue-500 text-white 
        rounded-full w-16 h-16 flex items-center justify-center 
        shadow-lg hover:bg-blue-600 transition-colors z-50"
        >
          <PlusIcon size={32} />
        </button>
      }
    </div>
  );
};

export default Home;