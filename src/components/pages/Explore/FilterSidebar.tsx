import React from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import type { FilterState } from '../../types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

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
        ? filters.categories.filter((cat: String) => cat !== category) // Remove category
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

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...filters.ingredients];
    newIngredients[index] = value;
    onFilterChange({
      ...filters,
      ingredients: newIngredients,
      page: 1
    });
  };

  const addIngredient = () => {
    onFilterChange({
      ...filters,
      ingredients: [...filters.ingredients, ''],
      page: 1
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = filters.ingredients.filter((_, i) => i !== index);
    onFilterChange({
      ...filters,
      ingredients: newIngredients,
      page: 1
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Ingredients</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className="h-8"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {filters.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder="Enter ingredient"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                  className="h-10 w-10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};


export default FilterSidebar;