const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes
} = require('../controllers/recipeController');

// Middleware placeholder for future authentication
// const authMiddleware = require('../middleware/authMiddleware');

// Route to get all recipes
router.get('/', getAllRecipes);

// Route to get a single recipe
router.get('/:id', getSingleRecipe);

// Route to create a new recipe
// Currently without auth, will add later
router.post('/', createRecipe);

// Route to update a recipe
router.put('/:id', updateRecipe);

// Route to delete a recipe
router.delete('/:id', deleteRecipe);

// Route to search recipes
router.get('/search', searchRecipes);

module.exports = router;