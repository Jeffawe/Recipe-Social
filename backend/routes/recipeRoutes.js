import express from 'express';
import multer from 'multer';
import { 
  createRecipe, 
  getAllRecipes, 
  getSingleRecipe, 
  updateRecipe, 
  deleteRecipe, 
  searchRecipes 
} from '../controllers/recipeController.js';

const router = express.Router();

// Configure multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB limit per file
    }
});

// Middleware placeholder for future authentication
// const authMiddleware = require('../middleware/authMiddleware');

// Route to get all recipes
router.get('/', getAllRecipes);

// Route to get a single recipe
router.get('/:id', getSingleRecipe);

// Route to create a new recipe
router.post('/', upload.array('images', 5), createRecipe);

// Route to search recipes
router.get('/search', searchRecipes);

// Route to update a recipe
router.put('/:id', updateRecipe);

// Route to delete a recipe
router.delete('/:id', deleteRecipe);

export default router;