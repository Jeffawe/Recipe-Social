import { uploadImagesToS3 } from './services/s3services.js';
import Recipe from '../models/Recipe.js';

export const createRecipe = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images provided' });
        }

        const uploadedImages = await uploadImagesToS3(req.files);

        const ingredients = JSON.parse(req.body.ingredients);
        const directions = JSON.parse(req.body.directions);

        const newRecipe = new Recipe({
            title: req.body.title,
            description: req.body.description,
            ingredients,
            directions,
            images: uploadedImages,
            cookingTime: JSON.parse(req.body.cookingTime),
            nutrition: JSON.parse(req.body.nutrition),
            category: req.body.category,
            author: req.user.userId
        });

        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating recipe',
            error: error.message
        });
    }
}

// export const createRecipe = async (req, res) => {

//     upload.array('images', 3)(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({
//                 message: 'Image upload failed',
//                 error: err.message
//             });
//         }

//         try {
//             // Upload images to S3
//             const imageUrls = req.files ? await uploadImagesToS3(req.files) : [];

//             // Parse JSON strings back to arrays
//             const ingredients = JSON.parse(req.body.ingredients);
//             const directions = JSON.parse(req.body.directions);

//             const testUser = await User.findOne({ isTestUser: true });

//             if (!testUser) {
//                 return res.status(400).json({ message: 'No test user found. Create a test user first.' });
//             }

//             const newRecipe = new Recipe({
//                 title: req.body.title,
//                 description: req.body.description,
//                 ingredients,
//                 directions,
//                 images: imageUrls,
//                 cookingTime: JSON.parse(req.body.cookingTime),
//                 nutrition: JSON.parse(req.body.nutrition),
//                 category: req.body.category,
//                 author: testUser._id
//             });

//             await newRecipe.save();
//             res.status(201).json(newRecipe);
//         } catch (error) {
//             res.status(500).json({
//                 message: 'Error creating recipe',
//                 error: error.message
//             });
//         }
//     });
// };

// Get all recipes with filtering and pagination

export const getAllRecipes = async (req, res) => {
    try {
        // Extract query parameters
        const {
            page = 1, //This is used for pagination.
            limit = 10, //limit that exists per page
            category
        } = req.query;

        // Build filter object
        const filter = {};
        if (category) filter.category = category;

        // Find recipes with filtering, pagination, and population
        const recipes = await Recipe.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('author', 'username') // Get author's username
            .sort({ createdAt: -1 }); // Sort by most recent first

        // Count total recipes for pagination
        const total = await Recipe.countDocuments(filter);

        // Respond with recipes and pagination info
        res.json({
            recipes,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching recipes',
            error: error.message
        });
    }
};

// Get a single recipe by ID
export const getSingleRecipe = async (req, res) => {
    try {
        // Find recipe by ID and populate related data
        const recipe = await Recipe.findById(req.params.id)
            .populate('author', 'username email');

        // Check if recipe exists
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching recipe',
            error: error.message
        });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        // Find recipe and check ownership
        const recipe = await Recipe.findById(req.params.id);

        // Ensure recipe exists and user is the author
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if current user is the author
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this recipe' });
        }

        // Update recipe
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Recipe updated successfully',
            recipe: updatedRecipe
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating recipe',
            error: error.message
        });
    }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
    try {
        // Find recipe and check ownership
        const recipe = await Recipe.findById(req.params.id);

        // Ensure recipe exists
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if current user is the author
        if (recipe.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this recipe' });
        }

        // Remove recipe from database
        await Recipe.findByIdAndDelete(req.params.id);

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting recipe',
            error: error.message
        });
    }
};

// Search recipes (basic implementation)
export const searchRecipes = async (req, res) => {
    try {
        const { query } = req.query;

        // Perform text search
        const recipes = await Recipe.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .limit(10);

        res.json(recipes);
    } catch (error) {
        res.status(500).json({
            message: 'Error searching recipes',
            error: error.message
        });
    }
};