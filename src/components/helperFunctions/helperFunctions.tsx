import axios from 'axios';
import { RecipeFormData, Image, RecipeData, User } from '../types/auth';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const convertToRecipeData = (formData: RecipeFormData, user: User): RecipeData => {
  const images: Image[] = formData.images.map(image => ({
    fileName: image.fileName,
    url: '',
    size: image.size,
    file: image.file || null
  }));

  return {
    _id: 'temp-' + Date.now(),
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
    external: false,
    pageURL: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const convertToRecipeFormData = async (formData: RecipeData): Promise<RecipeFormData> => {
  const hasNullFileName = formData.images?.some(image => !image.fileName);
  if (!hasNullFileName) {
    // No images with null fileName, just return the form data as it is
    return {
      title: formData.title,
      description: formData.description || '',
      ingredients: formData.ingredients,
      directions: formData.directions,
      images: formData.images || [],
      cookingTime: formData.cookingTime!,
      nutrition: formData.nutrition!,
      category: formData.category!,
      templateString: formData.templateString,
    };
  }

  // If there is an image with null or empty fileName, clear the images and fetch new data
  try {
    const response: any = await axios.get(`${API_BASE_URL}/recipes/${formData._id}/images`);
    const backendImages: Image[] = response.data;

    // Replace the images array with the images fetched from the backend
    const updatedImages = backendImages.map((backendImage) => ({
      fileName: backendImage.fileName || '',
      url: backendImage.url || '',
      size: backendImage.size,
      file: backendImage.file || null,
    }));

    // Return the updated form data with new images
    return {
      title: formData.title,
      description: formData.description || '',
      ingredients: formData.ingredients,
      directions: formData.directions,
      images: updatedImages,
      cookingTime: formData.cookingTime!,
      nutrition: formData.nutrition!,
      category: formData.category!,
      templateString: formData.templateString,
    };
  } catch (error) {
    console.error('Error fetching image data:', error);
    // Handle error, e.g., return the formData without updating images or display an error message
    return {
      title: formData.title,
      description: formData.description || '',
      ingredients: formData.ingredients,
      directions: formData.directions,
      images: formData.images || [],
      cookingTime: formData.cookingTime!,
      nutrition: formData.nutrition!,
      category: formData.category!,
      templateString: formData.templateString,
    };
  }
};