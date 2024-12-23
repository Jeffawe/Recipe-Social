// components/FilterSidebar.tsx
import React from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import type { FilterState } from '../../types/auth';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Appetizer', 'Beverage'];

  const handleCategoryClick = (category: string) => {
    const isCategorySelected = filters.categories.includes(category);
    onFilterChange({
      ...filters,
      categories: isCategorySelected
        ? filters.categories.filter((cat:String) => cat !== category) // Remove category
        : [...filters.categories, category], // Add category
      page: 1, // Reset to first page when filter changes
    });
  };

  const handleCookingTimeChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      cookingTime: value[0],
      page: 1 // Reset to first page when filter changes
    });
  };

  return (
    <Card className="p-4">
      <CardTitle className="mb-4">Filters</CardTitle>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Maximum Cooking Time</h3>
          <Slider
            value={[filters.cookingTime]}
            onValueChange={handleCookingTimeChange}
            max={180}
            step={15}
          />
          <span className="text-sm text-gray-600">{filters.cookingTime} minutes</span>
        </div>
      </div>
    </Card>
  );
};

export default FilterSidebar;