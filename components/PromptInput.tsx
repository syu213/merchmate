import React from 'react';
import { Button } from './Button';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImage: boolean;
  mode?: 'merch' | 'editor';
}

const EDIT_SUGGESTIONS = [
  "Add a retro VHS filter",
  "Turn into a cyberpunk neon sign",
  "Make it look like a pencil sketch",
  "Add a snowy winter background",
  "Remove the background"
];

export const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isGenerating,
  hasImage,
  mode = 'editor'
}) => {

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
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === 'editor' 
              ? "Describe how you want to change the image (e.g., 'Make it 8-bit pixel art')..." 
              : "Custom instructions for the merchandise..."
          }
          disabled={!hasImage || isGenerating}
          className="relative w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-0 resize-none transition-all disabled:opacity-50 placeholder:text-slate-600"
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
             <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold bg-slate-800 px-2 py-1 rounded">Gemini 2.5 Flash</span>
        </div>
      </div>

      {mode === 'editor' && (
        <div className="flex flex-wrap gap-2">
          {EDIT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s)}
              disabled={!hasImage || isGenerating}
              className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-indigo-300 border border-slate-700 rounded-full text-slate-400 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <Button 
        onClick={onGenerate} 
        isLoading={isGenerating} 
        disabled={!prompt.trim() || !hasImage}
        className="w-full py-4 text-lg font-semibold shadow-xl shadow-indigo-900/20"
        variant="primary"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      >
        {mode === 'editor' ? 'Magic Edit' : 'Generate Custom'}
      </Button>
    </div>
  );
};