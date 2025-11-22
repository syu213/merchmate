import React from 'react';
import { Button } from './Button';

interface ResultPreviewProps {
  resultImage: string | null;
  isGenerating: boolean;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({ resultImage, isGenerating }) => {
  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `mockup-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isGenerating) {
    return (
      <div className="w-full h-96 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center justify-center animate-pulse">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium">Creating your masterpiece...</p>
        <p className="text-slate-500 text-sm mt-2">Gemini is applying your logo to the scene</p>
      </div>
    );
  }

  if (!resultImage) {
    return (
      <div className="w-full h-96 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed flex flex-col items-center justify-center text-slate-500">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p>Generated mockup will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative group w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        <img 
          src={resultImage} 
          alt="Generated Mockup" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 pointer-events-none border-inset border-4 border-indigo-500/0 transition-all duration-500"></div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => window.open(resultImage, '_blank')}>
          Open Full Size
        </Button>
        <Button onClick={handleDownload} icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        }>
          Download PNG
        </Button>
      </div>
    </div>
  );
};