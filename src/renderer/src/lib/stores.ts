import { writable } from 'svelte/store';
import type { ImageSettings, ProcessedImage } from './types';

export const imageSettings = writable<ImageSettings>({
  width: 800,
  height: 600,
  keepOriginalDimensions: false,
  usePercentage: false,
  percentage: 100,
  format: 'webp',
  quality: 80,
  fit: 'scale',
  filePattern: 'processed_[name]'
});

export const images = writable<ProcessedImage[]>([]);
export const processing = writable<boolean>(false);
export const totalProgress = writable<number>(0);
export const darkMode = writable<boolean>(false);