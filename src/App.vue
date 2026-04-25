<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Locale, ModuleProgress, ContentTab } from './types';
import { modules, categories } from './data/modules';
import { getInitialProgress, saveProgress, updateModuleStatus } from './store/progress';
import ModuleCard from './components/ModuleCard.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import ProgressStats from './components/ProgressStats.vue';
import ModuleDetail from './components/ModuleDetail.vue';
import DockerStatus from './components/DockerStatus.vue';

const locale = ref<Locale>('it');
const progress = ref<ModuleProgress[]>([]);
const selectedCategory = ref<string | 'all'>('all');
const selectedModule = ref<typeof modules[0] | null>(null);
const activeTab = ref<ContentTab>('theory');
const dockerStatus = ref<'running' | 'stopped' | 'not_found' | 'error' | 'loading'>('loading');

onMounted(() => {
  progress.value = getInitialProgress();
});

watch(progress, (newProgress) => {
  saveProgress(newProgress);
}, { deep: true });

const filteredModules = computed(() => {
  if (selectedCategory.value === 'all') return modules;
  return modules.filter(m => m.category === selectedCategory.value);
});

function getModuleProgress(moduleId: number): ModuleProgress {
  const existing = progress.value.find(p => p.moduleId === moduleId);
  if (existing) return existing;
  return {
    moduleId,
    status: 'locked',
    completedAt: null,
    notes: '',
    completedLessons: [],
    completedActivities: []
  };
}

function handleStatusUpdate(moduleId: number, status: ModuleProgress['status']) {
  progress.value = updateModuleStatus(progress.value, moduleId, status);
}

function handleNotesUpdate(moduleId: number, notes: string) {
  const moduleProgress = progress.value.find(p => p.moduleId === moduleId);
  if (moduleProgress) {
    moduleProgress.notes = notes;
  }
}

function handleLessonComplete(moduleId: number, lessonId: string, complete: boolean) {
  const moduleProgress = progress.value.find(p => p.moduleId === moduleId);
  if (!moduleProgress) return;

  if (complete) {
    if (!moduleProgress.completedLessons.includes(lessonId)) {
      moduleProgress.completedLessons.push(lessonId);
    }
  } else {
    moduleProgress.completedLessons = moduleProgress.completedLessons.filter(id => id !== lessonId);
  }
}

function handleActivityComplete(moduleId: number, activityId: string, complete: boolean) {
  const moduleProgress = progress.value.find(p => p.moduleId === moduleId);
  if (!moduleProgress) return;

  if (complete) {
    if (!moduleProgress.completedActivities.includes(activityId)) {
      moduleProgress.completedActivities.push(activityId);
    }
  } else {
    moduleProgress.completedActivities = moduleProgress.completedActivities.filter(id => id !== activityId);
  }
}

const translations = {
  it: {
    title: 'DevTrack Academy',
    subtitle: 'Percorso di formazione Full-Stack, DevOps & AI',
    filterAll: 'Tutte le categorie',
    noModules: 'Nessun modulo trovato',
    backToModules: '← Torna ai moduli',
    tabTheory: 'Teoria',
    tabPractice: 'Pratica'
  },
  en: {
    title: 'DevTrack Academy',
    subtitle: 'Full-Stack, DevOps & AI Learning Path',
    filterAll: 'All categories',
    noModules: 'No modules found',
    backToModules: '← Back to modules',
    tabTheory: 'Theory',
    tabPractice: 'Practice'
  }
};

const t = computed(() => translations[locale.value]);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ t.title }}</h1>
            <p class="text-sm text-gray-600">{{ t.subtitle }}</p>
          </div>

          <div class="flex items-center gap-4">
            <DockerStatus @status-change="dockerStatus = $event" />
            <LanguageSwitcher v-model="locale" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- Module Detail View -->
      <div v-if="selectedModule">
        <button
          @click="selectedModule = null"
          class="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          {{ t.backToModules }}
        </button>

        <ModuleDetail
          :module="selectedModule"
          :progress="getModuleProgress(selectedModule.id)"
          :locale="locale"
          :activeTab="activeTab"
          :dockerStatus="dockerStatus"
          @update-tab="activeTab = $event"
          @complete-lesson="handleLessonComplete(selectedModule.id, $event.lessonId, $event.complete)"
          @complete-activity="handleActivityComplete(selectedModule.id, $event.activityId, $event.complete)"
          @back="selectedModule = null"
        />
      </div>

      <!-- Modules List View -->
      <template v-else>
        <!-- Progress Stats -->
        <ProgressStats :progress="progress" :locale="locale" class="mb-8" />

        <!-- Category Filter -->
        <div class="mb-6 flex flex-wrap gap-2">
          <button
            @click="selectedCategory = 'all'"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            ]"
          >
            {{ t.filterAll }}
          </button>

          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Modules Grid -->
        <div v-if="filteredModules.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            v-for="module in filteredModules"
            :key="module.id"
            :module="module"
            :progress="getModuleProgress(module.id)"
            :locale="locale"
            @update-status="handleStatusUpdate(module.id, $event)"
            @update-notes="handleNotesUpdate(module.id, $event)"
            @click="selectedModule = module"
          />
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          {{ t.noModules }}
        </div>
      </template>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-white mt-12">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <p class="text-center text-sm text-gray-500">
          DevTrack Academy © 2026 - Built with Vue 3 + TypeScript + Tailwind CSS
        </p>
      </div>
    </footer>
  </div>
</template>
