import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { Button } from './components/Button';
import { ProductSelector } from './components/ProductSelector';
import { editImage } from './services/geminiService';
import { GeneratedItem, ProductType, ProcessingState } from './types';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'merch' | 'editor'>('merch');

  // Data State
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [editorPrompt, setEditorPrompt] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>(['t-shirt', 'hoodie']);
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
  
  // Processing State
  const [processing, setProcessing] = useState<ProcessingState>({ isGenerating: false, activeCount: 0 });

  // Product Prompts Configuration
  const PRODUCT_PROMPTS: Record<ProductType, string> = {
    't-shirt': "Generate a professional product photography shot of a high-quality white cotton t-shirt folded neatly on a wooden surface. The logo provided in the input image should be printed realistically on the center chest area of the t-shirt. Cinematic lighting, 4k, photorealistic texture.",
    'hoodie': "Generate a realistic fashion shot of a model wearing a premium black streetwear hoodie in an urban setting at night. The logo provided should be clearly visible printed on the front of the hoodie. Neon city lighting in background, shallow depth of field.",
    'cap': "Generate a close-up macro product shot of a navy blue baseball cap sitting on a concrete surface. The logo provided should be embroidered on the front panel with realistic thread texture. High contrast, dramatic lighting."
  };

  // Handlers
  const toggleProduct = (product: ProductType) => {
    setSelectedProducts(prev => 
      prev.includes(product) 
        ? prev.filter(p => p !== product)
        : [...prev, product]
    );
  };

  const handleBatchGenerate = async () => {
    if (!sourceImage || selectedProducts.length === 0) return;

    setProcessing({ isGenerating: true, activeCount: selectedProducts.length });

    // Create placeholder items
    const timestamp = Date.now();
    const newItems: GeneratedItem[] = selectedProducts.map(type => ({
      id: `${timestamp}-${type}`,
      type: 'merch',
      originalImage: sourceImage,
      resultImage: null,
      prompt: PRODUCT_PROMPTS[type],
      status: 'pending',
      timestamp,
      category: type
    }));

    setGeneratedItems(prev => [...newItems, ...prev]);

    // Execute requests in parallel
    selectedProducts.forEach(async (type) => {
      const itemId = `${timestamp}-${type}`;
      try {
        const result = await editImage(sourceImage, PRODUCT_PROMPTS[type]);
        
        setGeneratedItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, resultImage: result, status: 'success' } 
            : item
        ));
      } catch (err) {
        let errorMessage = "Failed to generate";
        if (err instanceof Error) {
          if (err.name === 'RateLimitError') {
            errorMessage = "API quota exceeded. Please try again later.";
          } else {
            errorMessage = err.message;
          }
        }
        setGeneratedItems(prev => prev.map(item =>
          item.id === itemId
            ? { ...item, status: 'error', error: errorMessage }
            : item
        ));
      } finally {
        setProcessing(prev => {
          const newCount = prev.activeCount - 1;
          return { isGenerating: newCount > 0, activeCount: newCount };
        });
      }
    });
  };

  const handleEditorGenerate = async () => {
    if (!sourceImage || !editorPrompt) return;

    setProcessing({ isGenerating: true, activeCount: 1 });
    const timestamp = Date.now();
    const itemId = `${timestamp}-edit`;

    const newItem: GeneratedItem = {
      id: itemId,
      type: 'edit',
      originalImage: sourceImage,
      resultImage: null,
      prompt: editorPrompt,
      status: 'pending',
      timestamp
    };

    setGeneratedItems(prev => [newItem, ...prev]);

    try {
      const result = await editImage(sourceImage, editorPrompt);
      setGeneratedItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, resultImage: result, status: 'success' } : item
      ));
    } catch (err) {
      let errorMessage = "Failed to edit";
      if (err instanceof Error) {
        if (err.name === 'RateLimitError') {
          errorMessage = "API quota exceeded. Please try again later.";
        } else {
          errorMessage = err.message;
        }
      }
      setGeneratedItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, status: 'error', error: errorMessage } : item
      ));
    } finally {
      setProcessing({ isGenerating: false, activeCount: 0 });
    }
  };

  const handleDownload = (item: GeneratedItem) => {
    if (!item.resultImage) return;
    const link = document.createElement('a');
    link.href = item.resultImage;
    link.download = `merchmate-${item.type}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid-pattern bg-[size:40px_40px] text-slate-50">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur opacity-50 rounded-lg"></div>
              <div className="relative bg-indigo-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              MerchMate<span className="text-indigo-500">.ai</span>
            </span>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setActiveTab('merch')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'merch' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:text-white'}`}
            >
              👕 Merch Studio
            </button>
            <button 
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'editor' ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/50' : 'text-slate-400 hover:text-white'}`}
            >
              ✨ Magic Editor
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Input Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className={`w-2 h-8 rounded-full ${activeTab === 'merch' ? 'bg-indigo-500' : 'bg-fuchsia-500'}`}></span>
                {activeTab === 'merch' ? '1. Upload Logo' : '1. Upload Image'}
              </h2>
              <ImageUploader 
                selectedImage={sourceImage} 
                onImageSelect={setSourceImage}
                onClear={() => setSourceImage(null)}
                compact={true}
              />
            </div>

            {activeTab === 'merch' ? (
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-8 rounded-full bg-indigo-500"></span>
                  2. Select Products
                </h2>
                <ProductSelector 
                  selectedProducts={selectedProducts}
                  onToggle={toggleProduct}
                  disabled={processing.isGenerating}
                />
                <div className="mt-6">
                  <Button 
                    onClick={handleBatchGenerate}
                    disabled={!sourceImage || selectedProducts.length === 0 || processing.isGenerating}
                    isLoading={processing.isGenerating}
                    className="w-full py-4 text-lg"
                    variant="primary"
                  >
                     {processing.isGenerating 
                      ? `Generating ${processing.activeCount} Items...` 
                      : `Generate ${selectedProducts.length} Mockups`
                     }
                  </Button>
                </div>
              </div>
            ) : (
               <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-8 rounded-full bg-fuchsia-500"></span>
                  2. Describe Edits
                </h2>
                <PromptInput 
                  prompt={editorPrompt}
                  setPrompt={setEditorPrompt}
                  onGenerate={handleEditorGenerate}
                  isGenerating={processing.isGenerating}
                  hasImage={!!sourceImage}
                  mode="editor"
                />
               </div>
            )}
          </div>

          {/* Right Panel: Gallery / Results */}
          <div className="lg:col-span-8">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Generated Gallery
                  {processing.isGenerating && <span className="w-3 h-3 rounded-full bg-green-500 animate-ping"></span>}
                </h2>
                <span className="text-slate-500 text-sm">{generatedItems.length} Results</span>
             </div>

             {generatedItems.length === 0 ? (
               <div className="h-[600px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600 bg-slate-900/30">
                  <svg className="w-24 h-24 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl font-medium">Your designs will appear here</p>
                  <p className="text-sm opacity-60">Upload an image to get started</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedItems.map((item) => (
                    <div key={item.id} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl transition-all hover:border-indigo-500/50">
                      
                      {/* Image Area */}
                      <div className="aspect-square relative bg-slate-950 flex items-center justify-center">
                        {item.status === 'success' && item.resultImage ? (
                          <img src={item.resultImage} alt="Result" className="w-full h-full object-cover" />
                        ) : item.status === 'error' ? (
                           <div className="text-red-400 text-center p-4">
                              <p className="font-bold">Generation Failed</p>
                              <p className="text-sm opacity-80">{item.error}</p>
                           </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                            <span className="text-indigo-300 text-sm font-medium animate-pulse">Designing...</span>
                          </div>
                        )}
                        
                        {/* Type Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                            item.type === 'merch' 
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                            : 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30'
                          }`}>
                            {item.category || item.type}
                          </span>
                        </div>
                      </div>

                      {/* Actions Overlay */}
                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                         {item.status === 'success' && (
                           <>
                             <Button variant="primary" onClick={() => handleDownload(item)}>Download PNG</Button>
                             <Button variant="secondary" onClick={() => window.open(item.resultImage || '', '_blank')}>View Full Size</Button>
                           </>
                         )}
                      </div>

                      {/* Footer Info */}
                      <div className="p-4 border-t border-slate-800 bg-slate-900">
                         <p className="text-xs text-slate-400 line-clamp-2">{item.prompt}</p>
                      </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;