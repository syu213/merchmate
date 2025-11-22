import { GoogleGenAI } from "@google/genai";

console.log('API Key from env:', import.meta.env.VITE_GEMINI_API_KEY);
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
if (!apiKey) {
  console.error('API Key is missing! Check your .env.local file');
}

const ai = new GoogleGenAI({
  apiKey: apiKey
});

/**
 * Edits/Generates an image based on a source image and a text prompt.
 * Uses gemini-2.5-flash-image.
 */
export const editImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  try {
    // Clean base64 string if it contains metadata header
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content returned from Gemini.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};