// components/ExploreRecipes.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Loader2 } from 'lucide-react';
import type { Recipe, FilterState, RecipesResponse } from '../../types/auth.js';
import RecipeCard from './RecipeCard.js';
import FilterSidebar from './FilterSidebar.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ExploreRecipesProps {
  isMinimal?: boolean;
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
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMinimal);
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

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchRecipes();
  }, [filters.page, filters.categories]);

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

  // Main Content Component
  const MainContent = () => (
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

          <Pagination />
        </>
      )}
    </div>
  );

  return (
    <div className={`w-full ${isMinimal ? 'max-w-1xl' : 'max-w-5xl'} mx-auto p-4`}>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col space-y-6">
          {/* Centered Tabs */}
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">All Recipes</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="latest">Latest</TabsTrigger>
            </TabsList>
          </div>

          {/* Filter Toggle */}
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

        <TabsContent value="all" className="mt-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            {!isMinimal && isSidebarVisible && (
              <div className="w-64 shrink-0">
                <FilterSidebar 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}

            {/* Sheet for minimal mode */}
            {isMinimal && (
              <Sheet>
                <SheetContent>
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

        <TabsContent value="featured">
          <div className="flex gap-6">
            <MainContent />
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="flex gap-6">
            <MainContent />
          </div>
        </TabsContent>

        <TabsContent value="latest">
          <div className="flex gap-6">
            <MainContent />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;