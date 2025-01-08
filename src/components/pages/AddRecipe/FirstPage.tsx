import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Direction, Ingredient, RecipeFormData, Image } from '@/components/types/auth';

const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE, 10);
const MAX_FILES = parseInt(import.meta.env.VITE_MAX_FILES, 10);

// First Page Component
const RecipeDetailsPage: React.FC<{
    onNext: (data: RecipeFormData) => void;
    initialData?: RecipeFormData;
    addOrUpdate: string
    goBack: () => void
}> = ({ onNext, initialData, addOrUpdate, goBack }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [ingredients, setIngredients] = useState<Ingredient[]>(
        initialData?.ingredients || [{ name: '', quantity: '', unit: '' }]
    );
    const [directions, setDirections] = useState<Direction[]>(
        initialData?.directions || [{ step: 1, instruction: '' }]
    );
    const [images, setImages] = useState<Image[]>(initialData?.images || []);
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

    const [validationMessages, setValidationMessages] = useState({
        title: '',
        description: '',
        ingredients: '',
        directions: '',
    });

    // Define limits
    const LIMITS = {
        TITLE_MAX_LENGTH: 100,
        DESCRIPTION_MAX_LENGTH: 500,
        MAX_INGREDIENTS: 30,
        INGREDIENT_NAME_MAX_LENGTH: 50,
        DIRECTION_MAX_LENGTH: 1000,
        MAX_DIRECTIONS: 20,
        QUANTITY_MAX_LENGTH: 10
    };

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title)
            setDescription(initialData.description)
            setCategory(initialData.category)
            setCookingTime(initialData.cookingTime)
            setDirections(initialData.directions)
            setNutrition(initialData.nutrition)
            setImages(initialData.images)
        }
    }, [initialData]);

    const handleExit = () => {
        const isConfirmed = window.confirm('Are you sure you want to exit? Any unsaved changes will be lost.');
        if (isConfirmed) {
            goBack()
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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= LIMITS.TITLE_MAX_LENGTH) {
            setTitle(newValue);
            setValidationMessages(prev => ({ ...prev, title: '' }));
        } else {
            setValidationMessages(prev => ({
                ...prev,
                title: `Title cannot exceed ${LIMITS.TITLE_MAX_LENGTH} characters`
            }));
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= LIMITS.DESCRIPTION_MAX_LENGTH) {
            setDescription(newValue);
            setValidationMessages(prev => ({ ...prev, description: '' }));
        } else {
            setValidationMessages(prev => ({
                ...prev,
                description: `Description cannot exceed ${LIMITS.DESCRIPTION_MAX_LENGTH} characters`
            }));
        }
    };

    const addIngredient = () => {
        if (ingredients.length >= LIMITS.MAX_INGREDIENTS) {
            setValidationMessages(prev => ({
                ...prev,
                ingredients: `Maximum ${LIMITS.MAX_INGREDIENTS} ingredients allowed`
            }));
            return;
        }
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
        setValidationMessages(prev => ({ ...prev, ingredients: '' }));
    };

    const addDirection = () => {
        if (directions.length >= LIMITS.MAX_DIRECTIONS) {
            setValidationMessages(prev => ({
                ...prev,
                directions: `Maximum ${LIMITS.MAX_DIRECTIONS} steps allowed`
            }));
            return;
        }
        setDirections([...directions, { step: directions.length + 1, instruction: '' }]);
        setValidationMessages(prev => ({ ...prev, directions: '' }));
    };

    const handleIngredientNameChange = (index: number, value: string) => {
        if (value.length <= LIMITS.INGREDIENT_NAME_MAX_LENGTH) {
            const newIngredients = [...ingredients];
            newIngredients[index].name = value;
            setIngredients(newIngredients);
            setValidationMessages(prev => ({ ...prev, ingredients: '' }));
        }
    };

    const handleDirectionChange = (index: number, value: string) => {
        if (value.length <= LIMITS.DIRECTION_MAX_LENGTH) {
            const newDirections = [...directions];
            newDirections[index].instruction = value;
            setDirections(newDirections);
            setValidationMessages(prev => ({ ...prev, directions: '' }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (images.length + files.length > MAX_FILES) {
                alert(`You can only upload up to ${MAX_FILES} images.`);
                e.target.value = '';
                return;
            }

            const validFiles = files.filter((file) => {
                if (file.size > MAX_FILE_SIZE) {
                    alert(`File "${file.name}" is too large. Maximum size is ${MAX_FILE_SIZE / 1e6}MB.`);
                    return false;
                }
                if (!file.type.startsWith('image/')) {
                    alert(`File "${file.name}" is not an image.`);
                    return false;
                }
                return true;
            });

            const newImages = validFiles.map((file) => ({
                fileName: '',
                file,
                url: URL.createObjectURL(file),
                size: file.size,
            }));

            setImages((prevImages) => [...prevImages, ...newImages]);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="mx-auto p-6 relative bg-gradient-to-br from-orange-50 to-white">
            <button
                type="button"
                onClick={handleExit}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
            >
                <X size={24} />
            </button>

            <h1 className="text-3xl font-bold mb-6 text-gray-600">{addOrUpdate} Recipe Details</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block mb-2 text-gray-600">Recipe Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full p-2 border rounded"
                        required
                        maxLength={LIMITS.TITLE_MAX_LENGTH}
                    />
                    <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">
                            {title.length}/{LIMITS.TITLE_MAX_LENGTH} characters
                        </span>
                        {validationMessages.title && (
                            <span className="text-sm text-red-500">{validationMessages.title}</span>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-2 text-gray-600">Description</label>
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        className="w-full p-2 border rounded"
                        rows={4}
                        maxLength={LIMITS.DESCRIPTION_MAX_LENGTH}
                    />
                    <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">
                            {description.length}/{LIMITS.DESCRIPTION_MAX_LENGTH} characters
                        </span>
                        {validationMessages.description && (
                            <span className="text-sm text-red-500">{validationMessages.description}</span>
                        )}
                    </div>
                </div>

                {/* Ingredients Section */}
                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-600">Ingredients</h2>
                        <span className="text-sm text-gray-500">
                            {ingredients.length}/{LIMITS.MAX_INGREDIENTS} ingredients
                        </span>
                    </div>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                placeholder="Ingredient Name"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientNameChange(index, e.target.value)}
                                className="flex-1 p-2 border rounded"
                                required
                                maxLength={LIMITS.INGREDIENT_NAME_MAX_LENGTH}
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
                                maxLength={LIMITS.QUANTITY_MAX_LENGTH}
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
                            <button
                                type="button"
                                onClick={() => {
                                    const newIngredients = ingredients.filter((_, i) => i !== index);
                                    setIngredients(newIngredients);
                                }}
                                className="bg-red-500 text-white px-2 rounded"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    {validationMessages.ingredients && (
                        <span className="text-sm text-red-500 block mt-1">
                            {validationMessages.ingredients}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={addIngredient}
                        disabled={ingredients.length >= LIMITS.MAX_INGREDIENTS}
                        className={`bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded mt-2
                            ${ingredients.length >= LIMITS.MAX_INGREDIENTS ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Add Ingredient
                    </button>
                </div>

                {/* Directions Section */}
                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-600">Directions</h2>
                        <span className="text-sm text-gray-500">
                            {directions.length}/{LIMITS.MAX_DIRECTIONS} steps
                        </span>
                    </div>
                    {directions.map((direction, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                            <span className="font-bold">{direction.step}.</span>
                            <textarea
                                value={direction.instruction}
                                onChange={(e) => handleDirectionChange(index, e.target.value)}
                                className="flex-1 p-2 border rounded"
                                rows={2}
                                required
                                maxLength={LIMITS.DIRECTION_MAX_LENGTH}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newDirections = directions.filter((_, i) => i !== index);
                                    // Update steps after removal
                                    const updatedDirections = newDirections.map((dir, i) => ({
                                        ...dir,
                                        step: i + 1,
                                    }));
                                    setDirections(updatedDirections);
                                }}
                                className="bg-red-500 text-white px-2 rounded"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    {validationMessages.directions && (
                        <span className="text-sm text-red-500 block mt-1">
                            {validationMessages.directions}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={addDirection}
                        disabled={directions.length >= LIMITS.MAX_DIRECTIONS}
                        className={`bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded mt-2
                            ${directions.length >= LIMITS.MAX_DIRECTIONS ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                            src={image.url || URL.createObjectURL(image.file)}
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