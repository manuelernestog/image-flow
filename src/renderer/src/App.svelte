<script lang="ts">
  import Sidebar from './lib/components/Sidebar.svelte';
  import DropZone from './lib/components/DropZone.svelte';
  import { images, imageSettings, processing, totalProgress, darkMode } from './lib/stores';
  import JSZip from 'jszip';
  import { saveAs } from 'file-saver';
  import logo from "./assets/logo.png";

  let sidebarOpen = false;

  // Initialize dark mode from localStorage or system preference
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme !== null) {
      darkMode.set(storedTheme === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      darkMode.set(prefersDark);
    }
  }

  // Watch for dark mode changes and update HTML class and localStorage
  $: if (typeof document !== 'undefined') {
    if ($darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }

  async function processImage(image: File): Promise<Blob> {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(image);
    });
    
    let targetWidth = img.width;
    let targetHeight = img.height;
    
    if (!$imageSettings.keepOriginalDimensions) {
      if ($imageSettings.usePercentage) {
        const scale = $imageSettings.percentage / 100;
        targetWidth = Math.round(img.width * scale);
        targetHeight = Math.round(img.height * scale);
      } else {
        targetWidth = $imageSettings.width;
        targetHeight = $imageSettings.height;
      }
    }
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    if ($imageSettings.fit === 'crop') {
      const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (targetWidth - scaledWidth) / 2;
      const y = (targetHeight - scaledHeight) / 2;
      
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    } else {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    }
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob!),
        `image/${$imageSettings.format}`,
        $imageSettings.quality / 100
      );
    });
    
    URL.revokeObjectURL(img.src);
    
    return blob;
  }

  async function processImages() {
    if ($images.length === 0) return;
    
    processing.set(true);
    totalProgress.set(0);
    
    try {
      const zip = new JSZip();
      let processedCount = 0;
      
      for (const [index, image] of $images.entries()) {
        images.update(imgs => 
          imgs.map(img => 
            img.id === image.id 
              ? { ...img, processing: true }
              : img
          )
        );
        
        try {
          const processedBlob = await processImage(image.originalFile);
          
          const fileName = $imageSettings.filePattern
            .replace('[name]', image.originalFile.name.replace(/\.[^/.]+$/, ''))
            .replace('[number]', (index + 1).toString().padStart(3, '0')) + 
            '.' + $imageSettings.format;
            
          zip.file(fileName, processedBlob);
          
          images.update(imgs => 
            imgs.map(img => 
              img.id === image.id 
                ? { ...img, processed: true, processing: false }
                : img
            )
          );
        } catch (error) {
          images.update(imgs => 
            imgs.map(img => 
              img.id === image.id 
                ? { ...img, error: 'Processing failed', processing: false }
                : img
            )
          );
        }
        
        processedCount++;
        totalProgress.set((processedCount / $images.length) * 100);
      }
      
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });
      
      saveAs(content, 'processed-images.zip');
      
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      processing.set(false);
      totalProgress.set(0);
    }
  }

  $: progress = Math.round($totalProgress);
</script>

<div class="relative flex h-screen overflow-hidden">
  <!-- Mobile sidebar backdrop -->
  {#if sidebarOpen}
    <div 
      class="fixed inset-0 bg-black/20 lg:hidden backdrop-blur-sm"
      style="z-index: 40;"
      on:click={() => sidebarOpen = false}
    ></div>
  {/if}

  <!-- Sidebar -->
  <div
    class="fixed inset-y-0 left-0 transition-transform duration-200 transform lg:static lg:transform-none"
    style="z-index: 50;"
    class:translate-x-0={sidebarOpen}
    class:-translate-x-full={!sidebarOpen}
    class:lg:translate-x-0={true}
  >
    <Sidebar />
  </div>
  
  <main class="flex-1 p-4 lg:p-8 overflow-y-auto dark:bg-[#272727]">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8 bg-[--content-bg]  backdrop-blur-xl p-4 rounded-xl shadow-sm">
        <!-- Mobile menu button -->
        <button
          class="p-2 rounded-lg lg:hidden hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
          on:click={() => sidebarOpen = !sidebarOpen}
        >
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          
          <img src={logo} alt="ImageFlow" class="inline w-8 h-8 mx-2" />
          <span>
            ImageFlow
          </span>
        </h1>
        
        <div class="flex items-center gap-3">
          <button
            class="flex items-center justify-center w-10 h-10 p-0 btn btn-secondary"
            on:click={() => darkMode.update(d => !d)}
          >
            {#if $darkMode}
              🌞
            {:else}
              🌙
            {/if}
          </button>
          
          {#if $images.length > 0}
            <button
              class="hidden btn btn-secondary md:block"
              on:click={processImages}
              disabled={$processing || $images.length === 0}
            >
              {#if $processing}
                <span class="flex items-center gap-2">
                  Processing... {progress}%
                </span>
              {:else}
                Process & Download ({$images.length} {$images.length === 1 ? 'image' : 'images'})
              {/if}
            </button>

            <button
            class="btn btn-secondary md:hidden"
            on:click={processImages}
            disabled={$processing || $images.length === 0}
          >
          ⬇️
          </button>
          {/if}
        </div>
      </div>
      
      <div class="bg-[--content-bg] backdrop-blur-xl rounded-xl p-6 shadow-sm">
        <DropZone />
      </div>
      
      {#if $processing}
        <div class="mt-6 bg-[--content-bg] backdrop-blur-xl rounded-xl p-4 shadow-sm">
          <div class="h-2 overflow-hidden rounded-full bg-gray-200/50 dark:bg-gray-700/50">
            <div
              class="h-full transition-all duration-300 bg-primary-600/90 dark:bg-primary-500/90"
              style="width: {progress}%"
            />
          </div>
        </div>
      {/if}
    </div>
  </main>
</div>