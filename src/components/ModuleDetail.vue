<script setup lang="ts">
import { computed } from 'vue';
import type { LearningModule, ModuleProgress, Locale, ContentTab } from '../types';
import TheoryPanel from './TheoryPanel.vue';
import PracticePanel from './PracticePanel.vue';
import TerminalPanel from './TerminalPanel.vue';

const props = defineProps<{
  module: LearningModule;
  progress: ModuleProgress;
  locale: Locale;
  activeTab: ContentTab;
  dockerStatus: 'running' | 'stopped' | 'not_found' | 'error' | 'loading';
}>();

const emit = defineEmits<{
  (e: 'updateTab', tab: ContentTab): void;
  (e: 'completeLesson', payload: { lessonId: string; complete: boolean }): void;
  (e: 'completeActivity', payload: { activityId: string; complete: boolean }): void;
  (e: 'back'): void;
}>();

const t = computed(() => ({
  it: {
    back: '← Torna ai moduli',
    tabTheory: `Teoria (${props.module.theoryLessons.length})`,
    tabPractice: `Pratica (${props.module.practicalActivities.length})`,
    tabTerminal: `Terminale (${terminalActivitiesCount.value})`,
    progress: 'Progresso',
    noTheory: 'Nessuna lezione teorica disponibile',
    noPractice: 'Nessuna attività pratica disponibile',
    noTerminal: 'Nessun terminale disponibile per questo modulo'
  },
  en: {
    back: '← Back to modules',
    tabTheory: `Theory (${props.module.theoryLessons.length})`,
    tabPractice: `Practice (${props.module.practicalActivities.length})`,
    tabTerminal: `Terminal (${terminalActivitiesCount.value})`,
    progress: 'Progress',
    noTheory: 'No theory lessons available',
    noPractice: 'No practical activities available',
    noTerminal: 'No terminal available for this module'
  }
}[props.locale]));

const theoryProgress = computed(() => {
  if (props.module.theoryLessons.length === 0) return 0;
  return Math.round(
    (props.progress.completedLessons.length / props.module.theoryLessons.length) * 100
  );
});

const practiceProgress = computed(() => {
  if (props.module.practicalActivities.length === 0) return 0;
  return Math.round(
    (props.progress.completedActivities.length / props.module.practicalActivities.length) * 100
  );
});

const overallProgress = computed(() => {
  const totalItems = props.module.theoryLessons.length + props.module.practicalActivities.length;
  if (totalItems === 0) return 0;
  const completed = props.progress.completedLessons.length + props.progress.completedActivities.length;
  return Math.round((completed / totalItems) * 100);
});

const terminalActivitiesCount = computed(() => {
  return props.module.practicalActivities.filter(a => a.terminalUrl).length;
});

function setTab(tab: ContentTab) {
  emit('updateTab', tab);
}

function onLessonComplete(lessonId: string, complete: boolean) {
  emit('completeLesson', { lessonId, complete });
}

function onActivityComplete(activityId: string, complete: boolean) {
  emit('completeActivity', { activityId, complete });
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <button
              @click="$emit('back')"
              class="text-blue-100 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
            >
              {{ t.back }}
            </button>
          </div>
          <span class="text-blue-100 text-sm font-medium">{{ module.category }}</span>
          <h2 class="text-2xl font-bold mt-1">{{ module.title[locale] }}</h2>
          <p class="text-blue-100 mt-2">{{ module.description[locale] }}</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold">{{ overallProgress }}%</div>
          <div class="text-blue-100 text-sm">{{ t.progress }}</div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mt-4 bg-blue-800/30 rounded-full h-2">
        <div
          class="bg-white rounded-full h-2 transition-all"
          :style="{ width: overallProgress + '%' }"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <div class="flex">
        <button
          @click="setTab('theory')"
          :class="[
            'flex-1 px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center justify-center gap-2',
            activeTab === 'theory'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          {{ t.tabTheory }}
          <span
            v-if="theoryProgress > 0"
            :class="[
              'text-xs px-2 py-0.5 rounded-full',
              theoryProgress === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            ]"
          >
            {{ theoryProgress }}%
          </span>
        </button>

        <button
          @click="setTab('practice')"
          :class="[
            'flex-1 px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center justify-center gap-2',
            activeTab === 'practice'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          {{ t.tabPractice }}
          <span
            v-if="practiceProgress > 0"
            :class="[
              'text-xs px-2 py-0.5 rounded-full',
              practiceProgress === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            ]"
          >
            {{ practiceProgress }}%
          </span>
        </button>

        <button
          v-if="terminalActivitiesCount > 0 && dockerStatus === 'running'"
          @click="setTab('terminal')"
          :class="[
            'flex-1 px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center justify-center gap-2',
            activeTab === 'terminal'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {{ t.tabTerminal }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Theory Tab -->
      <div v-if="activeTab === 'theory'">
        <TheoryPanel
          v-if="module.theoryLessons.length > 0"
          :lessons="module.theoryLessons"
          :completedLessons="progress.completedLessons"
          :locale="locale"
          @complete="onLessonComplete"
        />
        <div v-else class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <p>{{ t.noTheory }}</p>
        </div>
      </div>

      <!-- Practice Tab -->
      <div v-else-if="activeTab === 'practice'">
        <PracticePanel
          v-if="module.practicalActivities.length > 0"
          :activities="module.practicalActivities"
          :completedActivities="progress.completedActivities"
          :locale="locale"
          @complete="onActivityComplete"
        />
        <div v-else class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          <p>{{ t.noPractice }}</p>
        </div>
      </div>

      <!-- Terminal Tab -->
      <div v-else-if="activeTab === 'terminal'">
        <div v-if="dockerStatus !== 'running'" class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <p class="text-lg font-medium text-gray-700 mb-2">
            {{ locale === 'it' ? 'Ambiente sandbox non attivo' : 'Sandbox environment not active' }}
          </p>
          <p class="text-sm">
            {{ locale === 'it' ? 'Avvia l\'ambiente Docker dall\'header per usare il terminale.' : 'Start the Docker environment from the header to use the terminal.' }}
          </p>
        </div>
        <div v-else-if="terminalActivitiesCount > 0">
          <div class="mb-4 text-sm text-gray-600">
            {{ locale === 'it' ? 'Usa il terminale qui sotto per eseguire comandi in tempo reale.' : 'Use the terminal below to run commands in real time.' }}
          </div>
          <TerminalPanel url="ws://localhost:3001" />
        </div>
        <div v-else class="text-center py-12 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p>{{ t.noTerminal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
