import React, { useCallback, useRef } from 'react';
import { Button } from './Button';

interface ImageUploaderProps {
  selectedImage: string | null;
  onImageSelect: (base64: string) => void;
  onClear: () => void;
  compact?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ selectedImage, onImageSelect, onClear, compact = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageSelect(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (selectedImage) {
    return (
      <div className={`relative group w-full ${compact ? 'h-32' : 'h-64'} bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden flex items-center justify-center`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <img 
          src={selectedImage} 
          alt="Uploaded Logo" 
          className="max-w-full max-h-full object-contain p-4 z-10" 
        />
        <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-20">
          <Button variant="secondary" onClick={onClear} className="mr-2">
            Change
          </Button>
        </div>
        {!compact && (
          <div className="absolute top-2 left-2 bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-2 py-0.5 rounded text-xs pointer-events-none z-20">
            Original
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`w-full ${compact ? 'h-32' : 'h-64'} border-2 border-dashed border-slate-700/50 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center bg-slate-900/30`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />
      <div className={`${compact ? 'p-2' : 'p-4'} bg-slate-800 rounded-full mb-3 text-indigo-400 shadow-lg shadow-black/20`}>
        <svg className={`${compact ? 'w-5 h-5' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-slate-300 font-medium text-sm">Click or drag image</p>
    </div>
  );
};