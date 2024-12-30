export interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
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

export interface Image {
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
  cookingTime: CookingTime
  nutrition: Nutrition
  category: string;
  templateString: string;
}

export interface Template {
  _id: string;
  template: string;
  author: string;  // MongoDB ObjectId as string
  public: boolean;
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

export interface RecipeData {
  title?: string;
  description?: string;
  ingredients?: Ingredient[];
  directions?: Direction[];
  images?: Image[];
  cookingTime?: CookingTime;
  nutrition?: Nutrition;
  category?: string;
  templateString?: string;
}

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


export const convertToRecipeData = (formData: RecipeFormData): RecipeData => {
  const images: Image[] = formData.images.map(file => ({
      fileName: file.name,
      url: URL.createObjectURL(file),
      size: file.size
  }));

  return {
      ...formData,
      images
  };
};
