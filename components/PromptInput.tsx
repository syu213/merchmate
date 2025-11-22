import React, { useState } from 'react';
import { Button } from './Button';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImage: boolean;
}

const SUGGESTIONS = [
  "Place this logo on a minimal white t-shirt lying flat",
  "Put this logo on a ceramic coffee mug on a wooden table",
  "Apply this design to a black hoodie worn by a model in a street setting",
  "Show this logo embossed on a leather notebook",
  "Print this on a tote bag hanging on a hook"
];

export const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isGenerating,
  hasImage
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && hasImage) {
        onGenerate();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasImage ? "Describe how you want to place the logo (e.g., 'On a blue cap')..." : "Upload an image first..."}
          disabled={!hasImage || isGenerating}
          className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all disabled:opacity-50 placeholder:text-slate-500"
        />
        <div className="absolute bottom-3 right-3 text-xs text-slate-500">
          Powered by Gemini 2.5 Flash
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant="ghost" 
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-xs"
        >
          {showSuggestions ? "Hide Ideas" : "Need Ideas?"}
        </Button>
        {showSuggestions && SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => setPrompt(s)}
            disabled={!hasImage || isGenerating}
            className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 transition-colors text-left truncate max-w-[200px] md:max-w-full"
          >
            {s}
          </button>
        ))}
      </div>

      <Button 
        onClick={onGenerate} 
        isLoading={isGenerating} 
        disabled={!prompt.trim() || !hasImage}
        className="w-full py-3 text-lg"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        }
      >
        Generate Mockup
      </Button>
    </div>
  );
};