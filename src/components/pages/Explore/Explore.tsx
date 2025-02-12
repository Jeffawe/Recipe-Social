import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import _ from 'lodash';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Loader2, Search } from 'lucide-react';
import type { RecipeData, FilterState, RecipesResponse } from '../../types/auth.js';
import RecipeCard from './RecipeCard.js';
import FilterSidebar from './FilterSidebar.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface ExploreRecipesProps {
  isMinimal?: boolean;
}

const Explore: React.FC<ExploreRecipesProps> = ({ isMinimal = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMinimal);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    cookingTime: 120,
    difficulty: 'all',
    page: 1,
    featured: false,
    popular: false,
    latest: false,
    limit: 20,
    ingredients: []
  });
  //const [likes, setLikes] = useState<string[]>([])

  const fetchRecipes = _.debounce(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.featured == true && { featured: 'true' }),
        ...(filters.popular && { popular: 'true' }),
        ...(filters.latest && { latest: 'true' }),
        ...(filters.categories.length && { category: filters.categories[0] }),
        ...(filters.ingredients.length && { ingredients: filters.ingredients[0] }),
        ...(searchTerm && { search: searchTerm })
      });

      localStorage.setItem('searchValue', searchTerm)
      const response = await axios.get<RecipesResponse>(
        `${API_BASE_URL}/recipes?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'api-key': API_KEY,
          }
        }
      );

      const externalRecipes = response.data.recipes.filter((recipe) => recipe.external === true);
      storeExternalRecipe(externalRecipes);
      setRecipes(response.data.recipes);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  }, 500);

  const storeExternalRecipe = (recipeData: RecipeData[]) => {
    localStorage.setItem('externalRecipes', JSON.stringify(recipeData));
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value == "featured") {
      setFilters(prev => ({ ...prev, featured: true, popular: false, latest: false, page: 1 }));
    } else if (value == "popular") {
      setFilters(prev => ({ ...prev, featured: false, popular: true, latest: false, page: 1 }));
    } else if (value == "latest") {
      setFilters(prev => ({ ...prev, featured: false, popular: false, latest: true, page: 1 }));
    } else {
      setFilters(prev => ({ ...prev, featured: false, popular: false, latest: false, page: 1 }));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm) {
      fetchRecipes();
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlSearchTerm = searchParams.get('search');

    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      fetchRecipes();
    }
  }, [location.search]);

  const Pagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pageNumbers = [];
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    pageNumbers.push(1);
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 2 && currentPage - 1 > 2) pageNumbers.push('...');
      pageNumbers.push(i);
      if (i === totalPages - 1 && currentPage + 1 < totalPages - 1) pageNumbers.push('...');
    }
    if (totalPages > 1) pageNumbers.push(totalPages);

    return (
      <div className="flex justify-center mt-8 gap-2 items-center">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
        >
          Previous
        </Button>

        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, page: page as number }))}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </Button>
      </div>
    );
  };

  const MainContent = () => (
    <div className="flex-1 min-h-screen w-full"> {/* Added w-full */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-black">Can't access any recipes at this time</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          {recipes.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No recipes found matching your criteria
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className={`w-full ${isMinimal ? 'max-w-1xl' : 'max-w-5xl'} mx-auto p-4`}>
      {!isMinimal &&
        <div className="mb-4">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border rounded-lg"
            />
            <button
              type="submit"
              className="absolute right-0 mr-1 p-2"
            >
              <Search
                className="text-gray-400 hover:text-gray-600"
                size={20}
              />
            </button>
          </form>
        </div>
      }
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col space-y-6">
          {/* Make tabs scrollable on mobile */}
          <div className="flex justify-center overflow-x-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">All Recipes</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="latest">Latest</TabsTrigger>
            </TabsList>
          </div>

          {/* Filter Toggle - adjusted for mobile */}
          <div className="flex justify-end">
            {isMinimal ? (
              <Button
                variant="outline"
                className='text-black'
                size="sm"
                onClick={() => navigate('/explore')}
              >
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className='text-black'
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {isSidebarVisible ? 'Hide Filters' : 'Show Filters'}
              </Button>
            )}
          </div>
        </div>

        {/* Modified TabsContent for all tabs */}
        {['all', 'featured', 'popular', 'latest'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="flex flex-col md:flex-row gap-6"> {/* Changed to flex-col on mobile */}
              {/* Sidebar - modified for responsive layout */}
              {!isMinimal && isSidebarVisible && (
                <div className="w-full md:w-64 md:shrink-0">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}

              {/* Sheet for minimal mode */}
              {isMinimal && (
                <Sheet>
                  <SheetContent side="top" className="w-full sm:max-w-xl">
                    <SheetHeader>
                      <SheetTitle>Filter Recipes</SheetTitle>
                    </SheetHeader>
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  </SheetContent>
                </Sheet>
              )}

              <MainContent />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modified Pagination for better mobile display */}
      <div className="mt-8 overflow-x-auto">
        <Pagination />
      </div>
    </div>
  );
};

export default Explore;
