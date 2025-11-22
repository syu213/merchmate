import express from 'express';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('dist')); // Serve production build

// Initialize Gemini AI with server-side API key
const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in environment variables');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Image generation endpoint
app.post('/api/generate', async (req, res) => {
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
        return res.json({
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
});

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API endpoint: http://localhost:${PORT}/api/generate`);
  console.log(`✅ API key is securely hidden on server`);
});