import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if search term is not empty
    if (searchTerm.trim()) {
      // Navigate to explore page with search query
      navigate(`/explore?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleAdvancedSearch = () => {
    navigate('/advanced-search');
  };

  return (
    <div className="px-4 py-6 bg-orange-500">
      <form 
        onSubmit={handleSearch} 
        className="flex items-center space-x-2 max-w-2xl mx-auto"
      >
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-800 placeholder-gray-400 focus:ring-orange-500 relative z-10"
          />
          <Search 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
            size={20} 
          />
        </div>
        
        <button 
          type="submit"
          className="bg-white border border-orange-500 text-orange-500 px-4 py-3 rounded-lg hover:bg-orange-50 transition-colors"
        >
          Search
        </button>
        
        <button 
          type="button"
          onClick={handleAdvancedSearch}
          className="bg-white border border-orange-500 text-orange-500 px-4 py-3 rounded-lg hover:bg-orange-50 transition-colors flex items-center"
        >
          <Filter className="mr-2" size={20} />
          Advanced
        </button>
      </form>
    </div>
  );
};

export default SearchBar;