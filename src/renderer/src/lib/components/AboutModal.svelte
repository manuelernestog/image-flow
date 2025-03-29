<script lang="ts">
  export let isOpen: boolean;
  export let onClose: () => void;
</script>

<div 
  class="fixed inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 p-4 w-screen h-screen"
  style="z-index: 9999;"
  class:opacity-0={!isOpen}
  class:pointer-events-none={!isOpen}
>
  <div 
    class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm transform transition-transform duration-200 shadow-xl relative"
    class:scale-95={!isOpen}
    class:scale-100={isOpen}
  >
    <div class="flex justify-between items-start mb-4">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">About</h2>
      <button 
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
        on:click={onClose}
      >
        ×
      </button>
    </div>
    
    <div class="space-y-4 text-center text-gray-600 dark:text-gray-300">
      <img src="/logo.png" alt="ImageFlow" class="w-24 h-24 inline mx-auto" />
      <a href="https://github.com/manuelernestog/image-flow"  target="_blank" 
      rel="noopener noreferrer" class="text-lg  font-semibold block">ImageFlow</a>
      <p class="text-sm  ">Free and open-source bulk image resizer and converter software</p>
      <p class="text-xs opacity-70 ">Version 1.0</p>
      <p class="">Created by <a href="https://github.com/manuelernestog" class="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400" target="_blank" rel="noopener noreferrer">Manuel Ernesto</a> </p>
      <p class="text-xs opacity-70 !mt-1">
        with ♥️ and some VibeCode :)
        </p>
      <a 
        href="https://ko-fi.com/manuelernestogarcia" 
        target="_blank" 
        rel="noopener noreferrer"
        class="inline-block bg-[#FFDD00] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#FFDD00]/90 transition-colors duration-200"
      >
        Buy me a coffee ☕
      </a>
    </div>
  </div>
</div>