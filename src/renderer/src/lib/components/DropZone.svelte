<script lang="ts">
  import { images, processing } from '../stores';
  import type { ProcessedImage } from '../types';
  
  let dragActive = false;
  
  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    dragActive = true;
  }
  
  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragActive = false;
  }
  
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragActive = false;
    
    if (!e.dataTransfer?.files) return;
    
    const files = Array.from(e.dataTransfer.files)
      .filter(file => file.type.startsWith('image/'));
      
    addImages(files);
  }
  
  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const files = Array.from(input.files)
      .filter(file => file.type.startsWith('image/'));
      
    addImages(files);
    input.value = '';
  }
  
  async function addImages(files: File[]) {
    const newImages: ProcessedImage[] = await Promise.all(
      files.map(async (file) => ({
        id: crypto.randomUUID(),
        originalFile: file,
        preview: URL.createObjectURL(file),
        processed: false
      }))
    );
    
    images.update(current => [...current, ...newImages]);
  }
  
  function removeImage(id: string) {
    images.update(current => {
      const image = current.find(img => img.id === id);
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
      return current.filter(img => img.id !== id);
    });
  }
  
  function clearAll() {
    images.update(current => {
      current.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
      return [];
    });
  }

  $: canAddMore = !$processing;
</script>

<div class="space-y-6">
  <div
    class="border-2 border-dashed rounded-xl p-8 text-center transition-colors border-gray-300/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30"
    class:drag-active={dragActive}
    class:opacity-50={!canAddMore}
    on:dragenter={handleDragEnter}
    on:dragover|preventDefault
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
  >
    <div class="space-y-4">
      <div class="text-gray-500 dark:text-gray-400">
        {#if $images.length === 0}
          <p class="text-lg">Drag and drop images here</p>
          <p class="text-sm">or</p>
        {:else}
          <p class="text-lg">Add more images</p>
        {/if}
      </div>
      
      <div>
        <label class="btn btn-secondary inline-block cursor-pointer">
          Browse Files
          <input
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            on:change={handleFileSelect}
            disabled={!canAddMore}
          />
        </label>
      </div>
    </div>
  </div>
  
  {#if $images.length > 0}
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">
          Images ({$images.length})
        </h3>
        <button
          class="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          on:click={clearAll}
          disabled={$processing}
        >
          Clear All
        </button>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {#each $images as image}
          <div class="relative group rounded-xl overflow-hidden bg-white/50 dark:bg-gray-800/50 shadow-sm backdrop-blur-sm">
            <img
              src={image.preview}
              alt={image.originalFile.name}
              class="w-full h-40 object-cover"
            />
            
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2">
              <p class="text-white text-sm truncate">
                {image.originalFile.name}
              </p>
            </div>
            
            <button
              class="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
              on:click={() => removeImage(image.id)}
              disabled={$processing}
            >
              ×
            </button>
            
            {#if image.processing}
              <div class="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <div class="bg-white/90 dark:bg-gray-800/90 text-primary-600 px-3 py-1 rounded-full text-sm shadow-sm">
                  Processing...
                </div>
              </div>
            {:else if image.processed}
              <div class="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                <div class="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm shadow-sm">
                  Done
                </div>
              </div>
            {:else if image.error}
              <div class="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center">
                <div class="bg-red-500/90 text-white px-3 py-1 rounded-full text-sm shadow-sm">
                  Error
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>