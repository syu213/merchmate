// Secure Gemini API service - communicates with backend proxy
// API key is hidden on server, never exposed to browser

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

/**
 * Edits/Generates an image via secure backend proxy
 * The API key never reaches the browser
 */
export const editImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        prompt
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 429) {
        const rateLimitError = new Error(
          errorData.error || 'API quota exceeded. Please try again later.'
        );
        rateLimitError.name = 'RateLimitError';
        throw rateLimitError;
      }

      throw new Error(
        errorData.error || `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.success || !data.image) {
      throw new Error('No image data returned from server');
    }

    return data.image;

  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
};

/**
 * Check if the backend server is available
 */
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.warn('Backend server not available:', error);
    return false;
  }
};