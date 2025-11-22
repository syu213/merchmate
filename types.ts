export interface MockupGeneration {
  id: string;
  originalImage: string; // Base64
  generatedImage: string; // Base64
  prompt: string;
  timestamp: number;
}

export interface ProcessingState {
  isGenerating: boolean;
  error: string | null;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16";
