import React from 'react';
import { ProductType } from '../types';

interface ProductSelectorProps {
  selectedProducts: ProductType[];
  onToggle: (product: ProductType) => void;
  disabled?: boolean;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ 
  selectedProducts, 
  onToggle,
  disabled 
}) => {
  const products: { id: ProductType; label: string; icon: React.ReactNode }[] = [
    { 
      id: 't-shirt', 
      label: 'T-Shirt',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> 
      // Actually let's use a better tshirt icon path
    },
    { 
      id: 'hoodie', 
      label: 'Hoodie',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    },
    { 
      id: 'cap', 
      label: 'Cap',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    }
  ];

  // Custom icons for better visuals
  const Icons = {
    't-shirt': (
      <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
    ),
    'hoodie': (
      <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 0-5 5v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a5 5 0 0 0-5-5z"/><path d="M4 11v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9"/><path d="M12 11v4"/></svg>
    ),
    'cap': (
      <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M7 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5"/><path d="M12 7V4"/><path d="M18 12c0-3.3-2.7-6-6-6s-6 2.7-6 6"/></svg>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => {
        const isSelected = selectedProducts.includes(product.id);
        return (
          <button
            key={product.id}
            onClick={() => onToggle(product.id)}
            disabled={disabled}
            className={`
              relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
              ${isSelected 
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-750'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {Icons[product.id]}
            <span className="font-medium">{product.label}</span>
            {isSelected && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full shadow-glow animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};