<script setup lang="ts">
import type { Locale } from '../types';

defineProps<{
  modelValue: Locale;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', locale: Locale): void;
}>();

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' }
];

function setLocale(locale: Locale) {
  emit('update:modelValue', locale);
}
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      v-for="loc in locales"
      :key="loc.code"
      @click="setLocale(loc.code)"
      :class="[
        'flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
        modelValue === loc.code
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
      ]"
    >
      <span>{{ loc.flag }}</span>
      <span>{{ loc.label }}</span>
    </button>
  </div>
</template>
