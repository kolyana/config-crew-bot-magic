
// API service for connecting to FastAPI backend

/**
 * Base URL for the FastAPI backend
 */
const API_BASE_URL = '/api';

/**
 * Generate a PR for a specific type using the FastAPI backend
 */
export const generatePRFromAPI = async (type: 'kafka' | 'kong' | 'gatekeeper', data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-pr/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate PR');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating PR:', error);
    throw error;
  }
};

/**
 * Test the API connection to verify backend is working
 */
export const testAPIConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hello`);
    if (!response.ok) {
      throw new Error('API test failed');
    }
    return await response.json();
  } catch (error) {
    console.error('API connection error:', error);
    throw error;
  }
};
