<script setup lang="ts">
import { ref } from 'vue';
import TerminalPanel from './TerminalPanel.vue';

defineProps<{
  url: string;
  label?: string;
}>();

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div class="mt-4">
    <button
      @click="toggle"
      :class="[
        'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors border',
        isOpen
          ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
          : 'bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800 hover:text-white'
      ]"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      {{ isOpen ? 'Chiudi terminale' : (label || 'Apri terminale') }}
    </button>

    <div v-if="isOpen" class="mt-2">
      <TerminalPanel :url="url" />
    </div>
  </div>
</template>
