export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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

export type Image = {
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

export interface RecipeImage {
  url: string;
}

export type Recipe = {
  _id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  directions: Direction[];
  images: Image[];
  cookingTime: CookingTime;
  nutrition: Nutrition;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Snack' | 'Appetizer' | 'Beverage';
  author: {
    _id: string;
    username: string;
  };
  comments: string[];
  faqs: string[];
  savedBy: string[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
};

export type RecipesResponse = {
  recipes: Recipe[];
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
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
}
