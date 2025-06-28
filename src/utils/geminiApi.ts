import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// IMPORTANT: Replace 'YOUR_API_KEY' with your actual Gemini API key.
// It is recommended to load this from an environment variable for security.
const LOCAL_STORAGE_KEY = 'gemini_api_key';

const getAndStoreApiKey = (): string | null => {
  console.log('getAndStoreApiKey: window.location.search:', window.location.search);
  const params = new URLSearchParams(window.location.search);
  const urlApiKey = params.get(LOCAL_STORAGE_KEY);
  console.log('getAndStoreApiKey: urlApiKey from URL params:', urlApiKey);
  let apiKey: string | null = null;

  if (urlApiKey) {
    // If key is in URL, store it in localStorage and remove from URL
    localStorage.setItem(LOCAL_STORAGE_KEY, urlApiKey);
    params.delete(LOCAL_STORAGE_KEY);
    window.history.replaceState({}, document.title, `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`);
    apiKey = urlApiKey;
    console.log('getAndStoreApiKey: Gemini API Key found in URL, stored in localStorage, and removed from URL.');
  } else {
    // Otherwise, try to get from localStorage
    apiKey = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (apiKey) {
      console.log('getAndStoreApiKey: Gemini API Key found in localStorage.');
    } else {
      console.log('getAndStoreApiKey: Gemini API Key not found in URL or localStorage.');
    }
  }
  return apiKey;
};

const API_KEY: string | null = getAndStoreApiKey();

let geminiModel: GenerativeModel | null = null;

/**
 * Initializes the Gemini GenerativeModel.
 * This function should be called once, typically when your application starts.
 */
export const initializeGeminiModel = (): void => {
  if (geminiModel) {
    console.log('Gemini GenerativeModel already initialized.');
    return;
  }

  if (!API_KEY) {
    console.error('Gemini API Key is not found. Please provide it via URL query parameter "gemini_api_key" or ensure it is in localStorage.');
    return;
  }
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Using gemini-1.5-flash as gemini-pro might not be available or supported for generateContent in this API version/region.
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Gemini GenerativeModel initialized successfully with gemini-1.5-flash.');
  } catch (error) {
    console.error('Failed to initialize Gemini GenerativeModel:', error);
  }
};

/**
 * Sends a text prompt to the Gemini API and returns the generated content.
 * @param prompt The text prompt to send to the Gemini model.
 * @returns A Promise that resolves with the generated text content, or null if an error occurs.
 */
export const getGeminiResponse = async (prompt: string): Promise<string | null> => {
  // Attempt to initialize if not already, in case it's called before index.tsx has a chance
  if (!geminiModel) {
    console.warn('Gemini GenerativeModel not initialized when getGeminiResponse was called. Attempting to initialize now.');
    initializeGeminiModel();
    if (!geminiModel) { // If still not initialized after attempt
      console.error('Gemini GenerativeModel could not be initialized. API calls will fail.');
      return null;
    }
  }

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error getting response from Gemini API:', error);
    return null;
  }
};