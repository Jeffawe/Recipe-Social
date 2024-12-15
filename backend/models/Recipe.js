const mongoose = require('mongoose');

// Define the schema for a Recipe
const RecipeSchema = new mongoose.Schema({
  // Basic Recipe Information
  title: {
    type: String,        // Specifies the data type as text
    required: true,      // Makes this field mandatory
    trim: true           // Removes whitespace from start and end
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: 500       // Limits description length
  },

  // Ingredients as an array of objects
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      enum: ['cup', 'tablespoon', 'teaspoon', 'gram', 'kg', 'ml', 'piece', 'slice'] // Predefined units
    }
  }],

  // Cooking directions as an ordered array
  directions: [{
    step: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true
    }
  }],

  // Media attachments
  images: [{
    url: {
      type: String,      // URL to the image
      required: true
    }
  }],

  // Recipe metadata
  cookingTime: {
    prep: {
      type: Number,      // Preparation time in minutes
      min: 0
    },
    cook: {
      type: Number,      // Cooking time in minutes
      min: 0
    }
  },

  // Nutritional information
  nutrition: {
    servings: Number,
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number
  },

  // Categorization
  category: {
    type: String,
    enum: [
      'Breakfast', 
      'Lunch', 
      'Dinner', 
      'Dessert', 
      'Snack', 
      'Appetizer', 
      'Beverage'
    ]
  },

  // User who created the recipe
  author: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to User model
    ref: 'User',                           // Connects to User model
    required: true
  },

  // Timestamps for creation and updates
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Mongoose options
  timestamps: true     // Automatically manage createdAt and updatedAt
});

// Create a text index for search functionality
RecipeSchema.index({ 
  title: 'text', 
  description: 'text', 
  'ingredients.name': 'text' 
});

// Export the model
module.exports = mongoose.model('Recipe', RecipeSchema);