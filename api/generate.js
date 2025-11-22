// Vercel Serverless Function for Gemini API
// File: api/generate.js

import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI with server-side API key
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY not found in environment variables');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, prompt } = req.body;

    if (!imageBase64 || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields: imageBase64 and prompt'
      });
    }

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
        return res.status(200).json({
          success: true,
          image: `data:image/png;base64,${part.inlineData.data}`
        });
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error('Generation error:', error);

    // Handle rate limit errors specifically
    if (error.message.includes('429') || error.message.includes('quota')) {
      return res.status(429).json({
        error: 'API quota exceeded. Please try again later.',
        retryAfter: error.message.includes('retryDelay') ?
          parseInt(error.message.match(/retryDelay":"(\d+)s/)?.[1] || 60) : 60
      });
    }

    res.status(500).json({
      error: 'Failed to generate image',
      details: error.message
    });
  }
}