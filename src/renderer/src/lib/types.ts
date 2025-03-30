export interface ImageSettings {
  width: number;
  height: number;
  keepOriginalDimensions: boolean;
  usePercentage: boolean;
  percentage: number;
  format: 'png' | 'jpeg' | 'webp' | 'gif' | 'tiff' | 'avif' | 'heic';
  quality: number;
  fit: 'cover' | 'contain' | 'fill';
  filePattern: string;
}

export interface ProcessedImage {
  id: string;
  originalFile: File;
  preview: string;
  processed: boolean;
  error?: string;
  processing?: boolean;
}

export interface ProcessingResult {
  success: boolean;
  error?: string;
}