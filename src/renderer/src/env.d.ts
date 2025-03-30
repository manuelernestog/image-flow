/// <reference types="vite/client" />

interface Window {
  api: {
    processImage: (imageBuffer: ArrayBuffer, options: any) => Promise<ArrayBuffer>;
  };
} 