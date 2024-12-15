const Recipe = require('../models/Recipe');
const User = require('../models/User');

exports.createRecipe = async (req, res) => {
    try {
        // Extract recipe data from request body
        const {
            title,
            description,
            ingredients,
            directions,
            images,
            cookingTime,
            nutrition,
            category,
            dietaryInfo
        } = req.body;

           // First, find the test user
        const testUser = await User.findOne({ isTestUser: true });

        if (!testUser) {
            return res.status(400).json({ message: 'No test user found. Create a test user first.' });
        }

        // Create new recipe object
        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            directions,
            images,
            cookingTime,
            nutrition,
            category,
            // Assuming user is authenticated and user ID is available
            author: testUser._id // This comes from authentication middleware
        });

        // Save recipe to database
        const savedRecipe = await newRecipe.save();

        // Respond with created recipe
        res.status(201).json({
            message: 'Recipe created successfully',
            recipe: savedRecipe
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating recipe',
            error: error.message
        });
    }
};

// Get all recipes with filtering and pagination
exports.getAllRecipes = async (req, res) => {
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
exports.getSingleRecipe = async (req, res) => {
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

exports.updateRecipe = async (req, res) => {
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
exports.deleteRecipe = async (req, res) => {
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
exports.searchRecipes = async (req, res) => {
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