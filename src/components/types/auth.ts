export interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
  profilePicture?: string;
  createdAt: string;
  createdRecipes: string[];
  savedRecipes : string[]
}

export type RecipeCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Snack' | 'Appetizer' | 'Beverage';

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

export interface Image {
  fileName: string;
  url: string;
  file: File
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
  images: Image[];
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
  external: boolean;
  pageURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  likes: string[];
  createdAt: string;
}

export interface FAQ {
  _id: string;
  author: {
    _id: string;
    username: string;
  };
  question: string;
  answer: string;
}

export type RecipesScrapeResponse = {
  data: RecipeData[];
  success: boolean
};

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
  featured: boolean,
  popular: boolean,
  latest: boolean,
  ingredients: string[];
};

// Define the state type
export interface RecipeDetailState {
  recipe: RecipeData | null;
  loading: boolean;
  error: string | null;
}