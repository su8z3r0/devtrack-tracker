<script setup lang="ts">
import { computed } from 'vue';
import type { ModuleProgress, Locale } from '../types';

const props = defineProps<{
  progress: ModuleProgress[];
  locale: Locale;
}>();

const stats = computed(() => {
  const total = props.progress.length;
  const completed = props.progress.filter(p => p.status === 'completed').length;
  const inProgress = props.progress.filter(p => p.status === 'in-progress').length;
  const percentage = Math.round((completed / total) * 100);

  return { total, completed, inProgress, percentage };
});

const labels = {
  it: {
    title: 'Progresso',
    completed: 'Completati',
    inProgress: 'In Corso',
    total: 'Totali'
  },
  en: {
    title: 'Progress',
    completed: 'Completed',
    inProgress: 'In Progress',
    total: 'Total'
  }
};

const text = computed(() => labels[props.locale]);
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800">{{ text.title }}</h2>
      <span class="text-3xl font-bold text-blue-600">{{ stats.percentage }}%</span>
    </div>

    <!-- Progress bar -->
    <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
      <div
        class="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
        :style="{ width: `${stats.percentage}%` }"
      ></div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-3 gap-4">
      <div class="text-center p-3 bg-green-50 rounded-lg">
        <div class="text-2xl font-bold text-green-600">{{ stats.completed }}</div>
        <div class="text-xs text-green-700 font-medium">{{ text.completed }}</div>
      </div>

      <div class="text-center p-3 bg-blue-50 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{{ stats.inProgress }}</div>
        <div class="text-xs text-blue-700 font-medium">{{ text.inProgress }}</div>
      </div>

      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <div class="text-2xl font-bold text-gray-600">{{ stats.total }}</div>
        <div class="text-xs text-gray-700 font-medium">{{ text.total }}</div>
      </div>
    </div>
  </div>
</template>
