<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PracticalActivity, Locale } from '../types';

const props = defineProps<{
  activities: PracticalActivity[];
  completedActivities: string[];
  locale: Locale;
}>();

const emit = defineEmits<{
  (e: 'complete', activityId: string, complete: boolean): void;
}>();

const expandedActivity = ref<string | null>(null);
const showHints = ref<Record<string, boolean>>({});

const t = computed(() => ({
  it: {
    completed: 'Completata',
    markComplete: 'Segna come completata',
    markIncomplete: 'Segna come da completare',
    showHints: 'Mostra suggerimenti',
    hideHints: 'Nascondi suggerimenti',
    tasks: 'Compiti da svolgere',
    successCriteria: 'Criteri di successo',
    hints: 'Suggerimenti',
    estimated: 'min',
    description: 'Descrizione',
    difficulty: 'Difficoltà'
  },
  en: {
    completed: 'Completed',
    markComplete: 'Mark as complete',
    markIncomplete: 'Mark as incomplete',
    showHints: 'Show hints',
    hideHints: 'Hide hints',
    tasks: 'Tasks to complete',
    successCriteria: 'Success criteria',
    hints: 'Hints',
    estimated: 'min',
    description: 'Description',
    difficulty: 'Difficulty'
  }
}[props.locale]));

const completionPercentage = computed(() => {
  return Math.round((props.completedActivities.length / props.activities.length) * 100);
});

function toggleActivity(activityId: string) {
  expandedActivity.value = expandedActivity.value === activityId ? null : activityId;
}

function isCompleted(activityId: string): boolean {
  return props.completedActivities.includes(activityId);
}

function toggleComplete(activityId: string) {
  emit('complete', activityId, !isCompleted(activityId));
}

function toggleHints(activityId: string) {
  showHints.value[activityId] = !showHints.value[activityId];
}

function getDifficultyColor(minutes: number): string {
  if (minutes <= 20) return 'text-green-600 bg-green-50';
  if (minutes <= 40) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
}
</script>

<template>
  <div class="space-y-4">
    <!-- Progress summary -->
    <div class="bg-green-50 rounded-lg p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <span class="text-green-700 font-bold">{{ completionPercentage }}%</span>
        </div>
        <div>
          <div class="font-medium text-green-900">
            {{ completedActivities.length }} / {{ activities.length }} {{ t.completed.toLowerCase() }}
          </div>
        </div>
      </div>

      <div class="text-sm text-green-600">
        {{ Math.round(activities.reduce((acc, a) => acc + a.estimatedMinutes, 0)) }} min total
      </div>
    </div>

    <!-- Activities list -->
    <div class="space-y-3">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="border border-gray-200 rounded-lg overflow-hidden"
        :class="{ 'border-green-300 bg-green-50/30': expandedActivity === activity.id }"
      >
        <!-- Activity header -->
        <div
          @click="toggleActivity(activity.id)"
          class="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <!-- Completion checkbox -->
          <button
            @click.stop="toggleComplete(activity.id)"
            :class="[
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              isCompleted(activity.id)
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-400'
            ]"
          >
            <svg
              v-if="isCompleted(activity.id)"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>

          <div class="flex-1">
            <h3 class="font-medium text-gray-900">{{ activity.title[locale] }}</h3>
            <div class="text-sm text-gray-500 flex items-center gap-3">
              <span :class="['px-2 py-0.5 rounded text-xs font-medium', getDifficultyColor(activity.estimatedMinutes)]">
                {{ activity.estimatedMinutes }} {{ t.estimated }}
              </span>
              <span v-if="isCompleted(activity.id)" class="text-green-600 font-medium">✓ {{ t.completed }}</span>
            </div>
          </div>

          <svg
            :class="['w-5 h-5 text-gray-400 transition-transform', expandedActivity === activity.id ? 'rotate-180' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        <!-- Activity content -->
        <div
          v-if="expandedActivity === activity.id"
          class="border-t border-gray-100 p-4 space-y-6"
        >
          <!-- Description -->
          <div class="prose prose-blue max-w-none">
            <p class="text-gray-700">{{ activity.description[locale] }}</p>
          </div>

          <!-- Tasks -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              {{ t.tasks }}
            </h4>
            <ul class="space-y-2">
              <li
                v-for="(task, idx) in activity.tasks[locale]"
                :key="idx"
                class="flex items-start gap-3 text-blue-800"
              >
                <span class="w-6 h-6 rounded-full bg-blue-200 text-blue-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {{ idx + 1 }}
                </span>
                <span class="text-sm">{{ task }}</span>
              </li>
            </ul>
          </div>

          <!-- Success criteria -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 class="font-medium text-green-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ t.successCriteria }}
            </h4>
            <ul class="space-y-1">
              <li
                v-for="criteria in activity.successCriteria[locale]"
                :key="criteria"
                class="flex items-start gap-2 text-green-800 text-sm"
              >
                <span class="text-green-500">✓</span>
                <span>{{ criteria }}</span>
              </li>
            </ul>
          </div>

          <!-- Hints (collapsible) -->
          <div v-if="activity.hints[locale].length > 0">
            <button
              @click="toggleHints(activity.id)"
              class="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              {{ showHints[activity.id] ? t.hideHints : t.showHints }}
            </button>

            <div v-if="showHints[activity.id]" class="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 class="font-medium text-amber-900 mb-2">{{ t.hints }}</h4>
              <ul class="space-y-2">
                <li
                  v-for="hint in activity.hints[locale]"
                  :key="hint"
                  class="flex items-start gap-2 text-amber-800 text-sm"
                >
                  <span class="text-amber-500">💡</span>
                  <span>{{ hint }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-3 pt-4 border-t border-gray-100">
            <button
              @click="toggleComplete(activity.id)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                isCompleted(activity.id)
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              ]"
            >
              <svg v-if="!isCompleted(activity.id)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{{ isCompleted(activity.id) ? t.markIncomplete : t.markComplete }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
