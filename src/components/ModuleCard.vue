<script setup lang="ts">
import { computed } from 'vue';
import type { LearningModule, ModuleProgress, Locale } from '../types';

const props = defineProps<{
  module: LearningModule;
  progress: ModuleProgress;
  locale: Locale;
}>();

const emit = defineEmits<{
  (e: 'update-status', status: ModuleProgress['status']): void;
  (e: 'update-notes', notes: string): void;
  (e: 'click'): void;
}>();

const totalItems = computed(() => {
  return (props.module.theoryLessons?.length || 0) + (props.module.practicalActivities?.length || 0);
});

const completedItems = computed(() => {
  return (props.progress.completedLessons?.length || 0) + (props.progress.completedActivities?.length || 0);
});

const itemProgress = computed(() => {
  if (totalItems.value === 0) return 0;
  return Math.round((completedItems.value / totalItems.value) * 100);
});

const statusConfig = {
  locked: {
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-gray-400',
    icon: '🔒',
    label: { it: 'Bloccato', en: 'Locked' }
  },
  'in-progress': {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: '📖',
    label: { it: 'In Corso', en: 'In Progress' }
  },
  completed: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: '✅',
    label: { it: 'Completato', en: 'Completed' }
  }
};

const config = computed(() => statusConfig[props.progress.status]);
const isLocked = computed(() => props.progress.status === 'locked');

function toggleStatus() {
  if (isLocked.value) return;

  const nextStatus: Record<ModuleProgress['status'], ModuleProgress['status']> = {
    'in-progress': 'completed',
    'completed': 'in-progress',
    'locked': 'locked'
  };

  emit('update-status', nextStatus[props.progress.status]);
}
</script>

<template>
  <div
    :class="[
      'rounded-lg border-2 p-4 transition-all duration-200 group',
      config.bg,
      config.border,
      isLocked ? 'opacity-75' : 'hover:shadow-md cursor-pointer hover:border-blue-300'
    ]"
    @click="!isLocked && $emit('click')"
  >
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl" :class="config.text">{{ config.icon }}</span>
        <span class="text-sm font-mono text-gray-500">#{{ String(module.id).padStart(2, '0') }}</span>
      </div>
      <span
        :class="[
          'text-xs px-2 py-1 rounded-full font-medium',
          config.bg,
          config.text
        ]"
      >
        {{ config.label[locale] }}
      </span>
    </div>

    <h3 :class="['font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors', config.text]">
      {{ module.title[locale] }}
    </h3>

    <p class="text-sm text-gray-600 mb-3">
      {{ module.description[locale] }}
    </p>

    <!-- Content count -->
    <div v-if="totalItems > 0 && !isLocked" class="mb-3">
      <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>
          {{ module.theoryLessons?.length || 0 }} {{ locale === 'it' ? 'lezioni' : 'lessons' }}
          ·
          {{ module.practicalActivities?.length || 0 }} {{ locale === 'it' ? 'attività' : 'activities' }}
        </span>
        <span :class="itemProgress === 100 ? 'text-green-600 font-medium' : ''">
          {{ itemProgress }}%
        </span>
      </div>
      <div class="bg-gray-200 rounded-full h-1.5">
        <div
          :class="[
            'h-1.5 rounded-full transition-all',
            itemProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
          ]"
          :style="{ width: itemProgress + '%' }"
        />
      </div>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-gray-500 bg-white/50 px-2 py-1 rounded">
        {{ module.category }}
      </span>

      <div class="flex gap-2">
        <button
          v-if="!isLocked"
          @click.stop="toggleStatus"
          :class="[
            'text-xs px-3 py-1 rounded font-medium transition-colors',
            progress.status === 'completed'
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          ]"
        >
          {{ progress.status === 'completed' ? (locale === 'it' ? 'In Corso' : 'In Progress') : (locale === 'it' ? 'Completato' : 'Completed') }}
        </button>
      </div>
    </div>

    <!-- Notes section -->
    <div v-if="!isLocked" class="mt-3 pt-3 border-t border-gray-200/50">
      <textarea
        :value="progress.notes"
        @click.stop
        @input="$emit('update-notes', ($event.target as HTMLTextAreaElement).value)"
        :placeholder="locale === 'it' ? 'Note personali...' : 'Personal notes...'"
        class="w-full text-sm p-2 rounded border border-gray-200 bg-white/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
        rows="2"
      ></textarea>
    </div>
  </div>
</template>
