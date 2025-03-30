<script lang="ts">
  import { imageSettings } from '../stores';
  import AboutModal from './AboutModal.svelte';
  
  const formats = ['png', 'jpeg', 'webp', 'gif', 'tiff', 'avif'];
  const fits = ['cover', 'contain' ,'fill'];
  
  let isAboutModalOpen = false;
</script>

<aside class="w-80 bg-[--sidebar-bg] backdrop-blur-xl border-r border-gray-200/20 dark:border-gray-700/20 p-6 h-screen overflow-y-auto flex flex-col shadow-lg lg:shadow-none">
  <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Settings</h2>
  
  <div class="space-y-8 flex-1">
    <section class="bg-[--content-bg] backdrop-blur-xl rounded-xl p-4 shadow-sm">
      <h3 class="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Image Output</h3>
      
      <div class="space-y-4">
        <div>
          <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <input
              type="checkbox"
              bind:checked={$imageSettings.keepOriginalDimensions}
              class="rounded text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
            />
            <span>Keep original dimensions</span>
          </label>
          
          {#if !$imageSettings.keepOriginalDimensions}
            <label class="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <input
                type="checkbox"
                bind:checked={$imageSettings.usePercentage}
                class="rounded text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
              />
              <span>Use percentage</span>
            </label>

            {#if $imageSettings.usePercentage}
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Scale percentage ({$imageSettings.percentage}%)
                </label>
                <input
                  type="range"
                  bind:value={$imageSettings.percentage}
                  min="1"
                  max="200"
                  class="w-full accent-primary-600"
                />
              </div>
            {:else}
              <div class="flex gap-2">
                <input
                  type="number"
                  bind:value={$imageSettings.width}
                  class="input w-24"
                  min="1"
                  placeholder="Width"
                />
                <span class="flex items-center text-gray-500 dark:text-gray-400">×</span>
                <input
                  type="number"
                  bind:value={$imageSettings.height}
                  class="input w-24"
                  min="1"
                  placeholder="Height"
                />
              </div>
            {/if}
          {/if}
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Format
          </label>
          <select
            bind:value={$imageSettings.format}
            class="select"
          >
            {#each formats as format}
              <option value={format}>{format.toUpperCase()}</option>
            {/each}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quality ({$imageSettings.quality}%)
          </label>
          <input
            type="range"
            bind:value={$imageSettings.quality}
            min="1"
            max="100"
            class="w-full accent-primary-600"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fit
          </label>
          <select
            bind:value={$imageSettings.fit}
            class="select"
          >
            {#each fits as fit}
              <option value={fit}>{fit[0].toUpperCase() + fit.slice(1)}</option>
            {/each}
          </select>
        </div>
      </div>
    </section>
    
    <section class="bg-[--content-bg] backdrop-blur-xl rounded-xl p-4 shadow-sm">
      <h3 class="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Export</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          File Pattern
        </label>
        <input
          type="text"
          bind:value={$imageSettings.filePattern}
          class="input"
          placeholder="processed_[name]"
        />
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Use [name] for original filename, [number] for sequence number
        </p>
      </div>
    </section>
  </div>
  
  <button
    class="mt-8 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    on:click={() => isAboutModalOpen = true}
  >
    About ImageFlow
  </button>
</aside>

<AboutModal 
  isOpen={isAboutModalOpen}
  onClose={() => isAboutModalOpen = false}
/>