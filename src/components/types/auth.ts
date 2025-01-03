export interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
  profilePicture?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (data: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface Direction {
  step: number;
  instruction: string;
}

export interface Ingredient2 {
  name: string;
  quantity: string;
  unit: 'cup' | 'tablespoon' | 'teaspoon' | 'gram' | 'kg' | 'ml' | 'piece' | 'slice';
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Image {
  fileName: string;
  url: string;
  size?: number;
};

export type CookingTime = {
  prep: number;
  cook: number;
};

export type Nutrition = {
  servings: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

export interface RecipeDirection {
  step: number;
  instruction: string;
}

export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: Ingredient[];
  directions: Direction[];
  images: File[];
  cookingTime: CookingTime;
  nutrition: Nutrition;
  category: RecipeCategory;
  templateString?: string;
}

export interface Template {
  _id: string;
  template: string;
  author: string;  // MongoDB ObjectId as string
  public: boolean;
}

export interface RecipeData {
  _id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  directions: Direction[];
  images?: Image[];
  cookingTime?: CookingTime;
  nutrition?: Nutrition;
  category?: RecipeCategory;
  comments?: string[];  // Or full Comment interface if populated
  faqs?: string[];      // Or full FAQ interface if populated
  likes?: string[];     // Or full User interface if populated
  featured?: boolean;
  latest?: boolean;
  popular?: boolean;
  templateID?: string;
  templateString?: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type RecipesResponse = {
  recipes: RecipeData[];
  totalPages: number;
  currentPage: number;
};

export type FilterState = {
  categories: string[];
  cookingTime: number;
  difficulty: string;
  page: number;
  limit: number;
};

// Define the state type
export interface RecipeDetailState {
  recipe: RecipeData | null;
  loading: boolean;
  error: string | null;
}


export const convertToRecipeData = (formData: RecipeFormData, user: User): RecipeData => {
  const images: Image[] = formData.images.map(file => ({
    fileName: file.name,
    url: URL.createObjectURL(file),
    size: file.size
  }));

  // Create a temporary _id until the server assigns a real one
  const tempId = 'temp-' + Date.now();
  
  return {
    _id: tempId,
    title: formData.title,
    description: formData.description,
    ingredients: formData.ingredients,
    directions: formData.directions,
    images,
    cookingTime: formData.cookingTime,
    nutrition: formData.nutrition,
    category: formData.category,
    templateString: formData.templateString,
    comments: [],
    faqs: [],
    likes: [],
    featured: false,
    latest: false,
    popular: false,
    author: {
      _id: user._id,
      username: user.username,
      email: user.email
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const convertToRecipeFormData = async (recipeData: RecipeData): Promise<RecipeFormData> => {
  const files: File[] = await Promise.all(
    recipeData.images?.map(async (image) => {
      return urlToFile(image.url, image.fileName);
    }) || []
  );

  return {
    title: recipeData.title,
    description: recipeData.description || "",
    ingredients: recipeData.ingredients.map(ingredient => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit
    })),
    directions: recipeData.directions.map(direction => ({
      step: direction.step,
      instruction: direction.instruction
    })),
    images: files,
    cookingTime: recipeData.cookingTime || { prep: 0, cook: 0 },
    nutrition: recipeData.nutrition || {
      servings: 0,
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0
    },
    category: recipeData.category || "Snack", // Default to Snack if category is missing
    templateString: recipeData.templateString
  };
};

const urlToFile = async (url: string, fileName: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

export type RecipeCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Snack' | 'Appetizer' | 'Beverage';