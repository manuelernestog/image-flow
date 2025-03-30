import sharp from 'sharp';
import { ipcMain } from 'electron';

interface ProcessImageOptions {
  format: 'png' | 'jpeg' | 'webp' | 'gif' | 'tiff' | 'avif' | 'heic';
  quality: number;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill';
  keepOriginalDimensions: boolean;
  usePercentage: boolean;
  percentage: number;
}

ipcMain.handle('process-image', async (_, imageBuffer: ArrayBuffer, options: ProcessImageOptions) => {
  try {
    let pipeline = sharp(Buffer.from(imageBuffer));
    
    // Get image metadata
    const metadata = await pipeline.metadata();
    
    if (!options.keepOriginalDimensions) {
      let targetWidth = options.width;
      let targetHeight = options.height;
      
      if (options.usePercentage && metadata.width && metadata.height) {
        const scale = options.percentage / 100;
        targetWidth = Math.round(metadata.width * scale);
        targetHeight = Math.round(metadata.height * scale);
      }
      
      pipeline = pipeline.resize({
        width: targetWidth,
        height: targetHeight,
        fit: options.fit || 'cover'
      });
    }

    // Set output format and quality
    switch (options.format) {
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality: options.quality });
        break;
      case 'png':
        pipeline = pipeline.png({ quality: options.quality });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality: options.quality });
        break;
      case 'gif':
        // GIF doesn't support quality option
        pipeline = pipeline.gif();
        break;
      case 'tiff':
        pipeline = pipeline.tiff({
          quality: options.quality,
          compression: 'lzw' // Using LZW compression for better compatibility
        });
        break;
      case 'avif':
        pipeline = pipeline.avif({
          quality: options.quality,
          effort: 4 // Medium encoding effort (range 0-9)
        });
        break;
      case 'heic':
        pipeline = pipeline.heif({
          quality: options.quality,
          compression: 'hevc' // Using HEVC compression
        });
        break;
    }

    const outputBuffer = await pipeline.toBuffer();
    return outputBuffer;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}); 