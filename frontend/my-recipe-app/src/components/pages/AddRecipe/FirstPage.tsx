import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Direction, Ingredient, RecipeFormData } from '@/components/types/auth';

const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE, 10);
const MAX_FILES = parseInt(import.meta.env.VITE_MAX_FILES, 10);


// First Page Component
const RecipeDetailsPage: React.FC<{
    onNext: (data: RecipeFormData) => void;
    initialData?: RecipeFormData;
}> = ({ onNext, initialData }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [ingredients, setIngredients] = useState<Ingredient[]>(
        initialData?.ingredients || [{ name: '', quantity: '', unit: '' }]
    );
    const [directions, setDirections] = useState<Direction[]>(
        initialData?.directions || [{ step: 1, instruction: '' }]
    );
    const [images, setImages] = useState<File[]>(initialData?.images || []);
    const [cookingTime, setCookingTime] = useState(initialData?.cookingTime || {
        prep: 0,
        cook: 0
    });
    const [nutrition, setNutrition] = useState(initialData?.nutrition || {
        servings: 0,
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0
    });
    const [category, setCategory] = useState(initialData?.category || 'Dinner');

    const handleExit = () => {
        const isConfirmed = window.confirm('Are you sure you want to exit? Any unsaved changes will be lost.');
        if (isConfirmed) {
            navigate('/');
        }
    };

    const validateInputs = () => {
        if (!title.trim()) return 'Title is required.';
        if (ingredients.some((ing) => !ing.name.trim())) return 'Each ingredient must have a name.';
        if (directions.some((dir) => !dir.instruction.trim())) return 'Each direction must have an instruction.';
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const error = validateInputs();
        if (error) {
            alert(error);
            return;
        }

        const templateString = ''

        onNext({
            title,
            description,
            ingredients,
            directions,
            images,
            cookingTime,
            nutrition,
            category,
            templateString
        });
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const addDirection = () => {
        setDirections([...directions, { step: directions.length + 1, instruction: '' }]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (images.length + files.length > MAX_FILES) {
                alert(`You can only upload up to ${MAX_FILES} images.`);
                e.target.value = '';
                return;
            }

            const validFiles = files.filter(file => {
                if (file.size > MAX_FILE_SIZE) {
                    alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
                    return false;
                }
                if (!file.type.startsWith('image/')) {
                    alert(`File "${file.name}" is not an image.`);
                    return false;
                }
                return true;
            });

            setImages(prevImages => [...prevImages, ...validFiles]);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };

    // Return the same JSX as your original form, but with handleSubmit modified
    return (
        <div className="mx-auto p-6 relative bg-gradient-to-br from-orange-50 to-white">
            <button
                type="button"
                onClick={handleExit}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
            >
                <X size={24} />
            </button>

            <h1 className="text-3xl font-bold mb-6 text-gray-600">Add Recipe Details</h1>

            {/* Rest of your form JSX here, but change the submit button text to "Next" */}
            {/* ... */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block mb-2 text-gray-600">Recipe Title</label>
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
                    <label className="block mb-2 text-gray-600">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={4}
                    />
                </div>

                {/* Ingredients Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-600">Ingredients</h2>
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
                                type="number"
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
                    <h2 className="text-2xl font-semibold mb-4 text-gray-600">Directions</h2>
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

                <div>
                    {/* Image Upload */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            Upload Images ({images.length}/{MAX_FILES})
                        </label>
                        <div className="text-sm text-gray-500 mb-2">
                            Maximum 5 images, each up to 5MB
                        </div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full p-2 border rounded"
                            disabled={images.length >= MAX_FILES}
                        />

                        {/* Image Preview Section */}
                        {images.length > 0 && (
                            <div className="mt-2 flex space-x-2 flex-wrap">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        {/* Image Preview */}
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index}`}
                                            className="w-24 h-24 object-cover rounded"
                                        />

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Next
                </button>
            </form>
        </div>
    );
};

export default RecipeDetailsPage