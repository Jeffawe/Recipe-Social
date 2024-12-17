import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeDetails, Ingredient, RecipeDirection, clearRecipeDetail, RecipeDetailState } from './recipeDetailSlice'

const RecipeDetail : React.FC  = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { recipe, loading, error } = useSelector((state:any) => state.recipeDetail);

  useEffect(() => {
    // Fetch recipe when component mounts
    if (id) {
      dispatch(fetchRecipeDetails() as any);
    }

    // Cleanup function to clear recipe detail when component unmounts
    return () => {
      dispatch(clearRecipeDetail());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading recipe: {error.message}
      </div>
    );
  }

  if (!recipe) {
    return <div>No recipe found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images Section */}
        <div>
          {recipe.images && recipe.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {recipe.images.map((image:any, index:number) => (
                <img 
                  key={index} 
                  src={image.url} 
                  alt={`Recipe image ${index + 1}`} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Recipe Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-gray-600 mb-4">{recipe.description}</p>

          {/* Cooking Time */}
          <div className="flex space-x-4 mb-4">
            <div>
              <strong>Prep Time:</strong> {recipe.cookingTime?.prep} mins
            </div>
            <div>
              <strong>Cook Time:</strong> {recipe.cookingTime?.cook} mins
            </div>
          </div>

          {/* Nutritional Info */}
          {recipe.nutrition && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Nutritional Information</h3>
              <ul>
                <li>Servings: {recipe.nutrition.servings}</li>
                <li>Calories: {recipe.nutrition.calories}</li>
                <li>Protein: {recipe.nutrition.protein}g</li>
                <li>Carbohydrates: {recipe.nutrition.carbohydrates}g</li>
                <li>Fat: {recipe.nutrition.fat}g</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ingredient:Ingredient, index:number) => (
            <li key={index}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Directions Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Directions</h2>
        <ol className="list-decimal list-inside">
          {recipe.directions.map((step:RecipeDirection) => (
            <li key={step.step} className="mb-2">
              {step.instruction}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDetail;