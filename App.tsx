import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ResultPreview } from './components/ResultPreview';
import { generateMerchMockup } from './services/geminiService';
import { MockupGeneration, ProcessingState } from './types';

const App: React.FC = () => {
  // State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<ProcessingState>({ isGenerating: false, error: null });
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [history, setHistory] = useState<MockupGeneration[]>([]);

  // Handlers
  const handleGenerate = async () => {
    if (!sourceImage || !prompt) return;

    setStatus({ isGenerating: true, error: null });
    
    try {
      const resultBase64 = await generateMerchMockup(sourceImage, prompt);
      
      setCurrentResult(resultBase64);
      
      // Add to history
      const newItem: MockupGeneration = {
        id: Date.now().toString(),
        originalImage: sourceImage,
        generatedImage: resultBase64,
        prompt,
        timestamp: Date.now()
      };
      
      setHistory(prev => [newItem, ...prev]);
    } catch (error: any) {
      setStatus({ 
        isGenerating: false, 
        error: error.message || "Failed to generate mockup. Please try again." 
      });
    } finally {
      setStatus(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const restoreHistoryItem = (item: MockupGeneration) => {
    setSourceImage(item.originalImage);
    setPrompt(item.prompt);
    setCurrentResult(item.generatedImage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              MerchMate AI
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            gemini-2.5-flash-image
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Error Banner */}
        {status.error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-red-400 font-medium">Generation Failed</h3>
              <p className="text-red-300/80 text-sm mt-1">{status.error}</p>
            </div>
            <button onClick={() => setStatus({ ...status, error: null })} className="text-red-400 hover:text-red-300">
              &times;
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-xs">1</span>
                  Upload Logo
                </h2>
              </div>
              <ImageUploader 
                selectedImage={sourceImage} 
                onImageSelect={setSourceImage}
                onClear={() => {
                  setSourceImage(null);
                  setCurrentResult(null);
                }}
              />
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-xs">2</span>
                  Describe Mockup
                </h2>
              </div>
              <PromptInput 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onGenerate={handleGenerate}
                isGenerating={status.isGenerating}
                hasImage={!!sourceImage}
              />
            </section>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
             <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Preview</h2>
                {currentResult && (
                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/20">
                    Success
                  </span>
                )}
              </div>
              
              <ResultPreview 
                resultImage={currentResult}
                isGenerating={status.isGenerating}
              />

              {/* History (Horizontal Scroll if sticky space allows, otherwise handled below) */}
             </div>
          </div>

        </div>

        {/* History Section */}
        {history.length > 0 && (
          <section className="mt-16 pt-8 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6">Recent Generations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {history.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => restoreHistoryItem(item)}
                  className="group relative bg-slate-800 rounded-lg overflow-hidden cursor-pointer border border-slate-700 hover:border-indigo-500 transition-all"
                >
                  <div className="aspect-square">
                    <img src={item.generatedImage} alt="History" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-xs text-white line-clamp-2">{item.prompt}</p>
                    <span className="text-[10px] text-indigo-300 mt-1">Click to load</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;