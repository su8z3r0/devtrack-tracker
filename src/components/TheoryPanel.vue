<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TheoryLesson, Locale } from '../types';
import MarkdownRenderer from './MarkdownRenderer.vue';

const props = defineProps<{
  lessons: TheoryLesson[];
  completedLessons: string[];
  locale: Locale;
}>();

const emit = defineEmits<{
  (e: 'complete', lessonId: string, complete: boolean): void;
}>();

const expandedLesson = ref<string | null>(null);
const searchQuery = ref('');

const t = computed(() => ({
  it: {
    search: 'Cerca nelle lezioni...',
    completed: 'Completata',
    markComplete: 'Segna come completata',
    markIncomplete: 'Segna come da completare',
    keyPoints: 'Punti chiave',
    examples: 'Esempi di codice',
    estimated: 'min di lettura',
    expand: 'Espandi',
    collapse: 'Riduci'
  },
  en: {
    search: 'Search lessons...',
    completed: 'Completed',
    markComplete: 'Mark as complete',
    markIncomplete: 'Mark as incomplete',
    keyPoints: 'Key points',
    examples: 'Code examples',
    estimated: 'min read',
    expand: 'Expand',
    collapse: 'Collapse'
  }
}[props.locale]));

const filteredLessons = computed(() => {
  if (!searchQuery.value) return props.lessons;
  const query = searchQuery.value.toLowerCase();
  return props.lessons.filter(lesson =>
    lesson.title[props.locale].toLowerCase().includes(query) ||
    lesson.content[props.locale].toLowerCase().includes(query)
  );
});

const completionPercentage = computed(() => {
  return Math.round((props.completedLessons.length / props.lessons.length) * 100);
});

function toggleLesson(lessonId: string) {
  expandedLesson.value = expandedLesson.value === lessonId ? null : lessonId;
}

function isCompleted(lessonId: string): boolean {
  return props.completedLessons.includes(lessonId);
}

function toggleComplete(lessonId: string) {
  emit('complete', lessonId, !isCompleted(lessonId));
}
</script>

<template>
  <div class="space-y-4">
    <!-- Search -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t.search"
        class="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
    </div>

    <!-- Progress summary -->
    <div class="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span class="text-blue-700 font-bold">{{ completionPercentage }}%</span>
        </div>
        <div>
          <div class="font-medium text-blue-900">
            {{ completedLessons.length }} / {{ lessons.length }} {{ t.completed.toLowerCase() }}
          </div>
        </div>
      </div>

      <div class="text-sm text-blue-600">
        {{ Math.round(lessons.reduce((acc, l) => acc + l.estimatedMinutes, 0)) }} min total
      </div>
    </div>

    <!-- Lessons list -->
    <div class="space-y-3">
      <div
        v-for="lesson in filteredLessons"
        :key="lesson.id"
        class="border border-gray-200 rounded-lg overflow-hidden"
        :class="{ 'border-blue-300 bg-blue-50/30': expandedLesson === lesson.id }"
      >
        <!-- Lesson header -->
        <div
          @click="toggleLesson(lesson.id)"
          class="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <!-- Completion checkbox -->
          <button
            @click.stop="toggleComplete(lesson.id)"
            :class="[
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              isCompleted(lesson.id)
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-blue-400'
            ]"
          >
            <svg
              v-if="isCompleted(lesson.id)"
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>

          <div class="flex-1">
            <h3 class="font-medium text-gray-900">{{ lesson.title[locale] }}</h3>
            <div class="text-sm text-gray-500 flex items-center gap-2">
              <span>{{ lesson.estimatedMinutes }} {{ t.estimated }}</span>
              <span v-if="isCompleted(lesson.id)" class="text-green-600">✓ {{ t.completed }}</span>
            </div>
          </div>

          <svg
            :class="['w-5 h-5 text-gray-400 transition-transform', expandedLesson === lesson.id ? 'rotate-180' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        <!-- Lesson content -->
        <div
          v-if="expandedLesson === lesson.id"
          class="border-t border-gray-100 p-4 space-y-6"
        >
          <!-- Main content -->
          <div class="prose prose-blue max-w-none">
            <MarkdownRenderer :content="lesson.content[locale]" />
          </div>

          <!-- Key points -->
          <div v-if="lesson.keyPoints[locale].length > 0" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 class="font-medium text-amber-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              {{ t.keyPoints }}
            </h4>
            <ul class="space-y-2">
              <li
                v-for="point in lesson.keyPoints[locale]"
                :key="point"
                class="flex items-start gap-2 text-amber-800"
              >
                <span class="text-amber-500 mt-0.5">▸</span>
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>

          <!-- Code examples -->
          <div v-if="lesson.codeExamples?.length" class="space-y-4">
            <h4 class="font-medium text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              {{ t.examples }}
            </h4>

            <div
              v-for="(example, idx) in lesson.codeExamples"
              :key="idx"
              class="bg-gray-900 rounded-lg overflow-hidden"
            >
              <div class="flex items-center justify-between px-4 py-2 bg-gray-800">
                <span class="text-gray-400 text-sm">{{ example.language }}</span>
              </div>
              <pre class="p-4 overflow-x-auto"><code class="text-sm text-gray-100">{{ example.code }}</code></pre>
              <div v-if="example.explanation" class="px-4 py-2 bg-gray-800/50 text-gray-400 text-sm">
                {{ example.explanation }}
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-3 pt-4 border-t border-gray-100">
            <button
              @click="toggleComplete(lesson.id)"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
                isCompleted(lesson.id)
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
            >
              <svg v-if="!isCompleted(lesson.id)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{{ isCompleted(lesson.id) ? t.markIncomplete : t.markComplete }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
