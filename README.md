<div align="center">
  <h1>🎨 MerchMate AI</h1>
  <p>Generate product mockups and perform AI-powered image editing with Google's Gemini AI</p>
  <p>
    <strong>Merch Studio</strong> • <strong>Magic Editor</strong> • <strong>Real-time Processing</strong>
  </p>
</div>

# MerchMate AI

A powerful React-based web application that generates product mockups and performs AI-powered image editing using Google's Gemini AI. The app features two main modes:

- **👕 Merch Studio**: Generate professional product mockups (t-shirts, hoodies, caps) with your uploaded logos
- **✨ Magic Editor**: Perform custom image edits based on text prompts

## ✨ Features

### Merch Studio
- Upload your logo and generate professional product mockups
- Support for multiple product types: T-shirts, Hoodies, Caps
- Batch processing with parallel API calls for faster generation
- Professional lighting and photography styling

### Magic Editor
- Custom image editing with natural language prompts
- Real-time preview and results
- Download generated images directly

### Technical Features
- **Modern Tech Stack**: React 19, TypeScript, Vite
- **Beautiful UI**: Tailwind CSS with custom dark theme
- **AI Integration**: Google Gemini 2.5 Flash Image model
- **Real-time Updates**: Live status updates during generation
- **Responsive Design**: Works on all device sizes
- **Error Handling**: Comprehensive error states and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Google Gemini API key (get one at [AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd merchmate
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.local.example .env.local

   # Edit .env.local and add your Gemini API key:
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` (or the URL shown in terminal)

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Project Structure

```
merchmate/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── ImageUploader.tsx
│   ├── PromptInput.tsx
│   ├── ProductSelector.tsx
│   └── ResultPreview.tsx
├── services/            # External service integrations
│   └── geminiService.ts # Google Gemini API
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── types.ts            # TypeScript type definitions
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🎨 Customization

### Adding New Products

1. Add new product type to `types.ts`:
```typescript
export type ProductType = 't-shirt' | 'hoodie' | 'cap' | 'your-new-product';
```

2. Add prompt to `App.tsx`:
```typescript
const PRODUCT_PROMPTS: Record<ProductType, string> = {
  // ... existing products
  'your-new-product': "Your custom prompt here..."
};
```

### Custom Styling

The app uses Tailwind CSS with a custom configuration. Modify `tailwind.config.js` to:
- Change the color scheme
- Add custom fonts
- Extend spacing and other utilities

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini AI API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** The API key must be prefixed with `VITE_` to be available in the browser.

## 🤖 AI Integration

The app uses Google's Gemini 2.5 Flash Image model with these capabilities:

- **Image Generation**: Create new images based on prompts and input images
- **Product Mockups**: Professional product photography with realistic lighting
- **Custom Edits**: Modify images based on natural language instructions

### API Usage

The API is accessed through the `geminiService.ts` module, which handles:
- Base64 image processing
- API request/response handling
- Error management
- Response parsing

## 🌟 Examples

### Merch Studio Usage
1. Upload your logo or design
2. Select desired products (t-shirt, hoodie, cap)
3. Click "Generate Mockups"
4. Download your professional product photos

### Magic Editor Usage
1. Upload any image
2. Describe your desired changes (e.g., "Change background to sunset", "Add sunglasses")
3. Click "Generate"
4. Download the edited image

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).