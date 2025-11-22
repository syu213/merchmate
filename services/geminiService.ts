import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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