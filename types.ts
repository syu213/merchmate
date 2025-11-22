export interface GeneratedItem {
  id: string;
  type: 'merch' | 'edit';
  originalImage: string;
  resultImage: string | null;
  prompt: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
  timestamp: number;
  category?: 't-shirt' | 'hoodie' | 'cap' | 'other';
}

export type ProductType = 't-shirt' | 'hoodie' | 'cap';

export interface ProcessingState {
  isGenerating: boolean;
  activeCount: number;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16";