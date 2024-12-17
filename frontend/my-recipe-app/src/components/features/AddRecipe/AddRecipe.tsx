import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Direction {
  step: number;
  instruction: string;
}

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: '', unit: '' }
  ]);
  const [directions, setDirections] = useState<Direction[]>([
    { step: 1, instruction: '' }
  ]);
  const [images, setImages] = useState<File[]>([]);

  const handleExit = () => {
    const isConfirmed = window.confirm('Are you sure you want to exit? Any unsaved changes will be lost.');
    if (isConfirmed) {
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData for file upload
    const formData = new FormData();

    // Append text fields
    formData.append('title', title);
    formData.append('description', description);

    // Append ingredients
    formData.append('ingredients', JSON.stringify(ingredients));

    // Append directions
    formData.append('directions', JSON.stringify(directions));

    // Append images
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    try {
      const response:any = await axios.post('/api/routes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Navigate to the new recipe's detail page
      navigate(`/recipe/${response.data._id}`);
      navigate('/');
    } catch (error) {
      console.error('Error creating recipe:', error);
      // Handle error (show error message, etc.)
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const addDirection = () => {
    setDirections([
      ...directions,
      { step: directions.length + 1, instruction: '' }
    ]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div className="container mx-auto p-6 relative">
      <button
        type="button"
        onClick={handleExit}
        className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
        aria-label="Exit Recipe Creation"
      >
        <X size={24} />
      </button>

      <h1 className="text-3xl font-bold mb-6">Add New Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-2">Recipe Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        {/* Ingredients Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Ingredient Name"
                value={ingredient.name}
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[index].name = e.target.value;
                  setIngredients(newIngredients);
                }}
                className="flex-1 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[index].quantity = e.target.value;
                  setIngredients(newIngredients);
                }}
                className="w-24 p-2 border rounded"
                required
              />
              <select
                value={ingredient.unit}
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[index].unit = e.target.value;
                  setIngredients(newIngredients);
                }}
                className="w-32 p-2 border rounded"
                required
              >
                <option value="">Unit</option>
                <option value="cup">Cup</option>
                <option value="tablespoon">Tablespoon</option>
                <option value="teaspoon">Teaspoon</option>
                <option value="gram">Gram</option>
                <option value="kg">KG</option>
                <option value="ml">ML</option>
                <option value="piece">Piece</option>
                <option value="slice">Slice</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Ingredient
          </button>
        </div>

        {/* Directions Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Directions</h2>
          {directions.map((direction, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <span className="font-bold">{direction.step}.</span>
              <textarea
                value={direction.instruction}
                onChange={(e) => {
                  const newDirections = [...directions];
                  newDirections[index].instruction = e.target.value;
                  setDirections(newDirections);
                }}
                className="flex-1 p-2 border rounded"
                rows={2}
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addDirection}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Step
          </button>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
          {images.length > 0 && (
            <div className="mt-2 flex space-x-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Create Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;