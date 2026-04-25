<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const emit = defineEmits<{
  (e: 'statusChange', status: 'running' | 'stopped' | 'not_found' | 'error' | 'loading'): void;
}>();

const status = ref<'running' | 'stopped' | 'not_found' | 'error' | 'loading'>('loading');
const isLoading = ref(false);
const errorMsg = ref('');
let pollInterval: ReturnType<typeof setInterval> | null = null;

watch(status, (newStatus) => {
  emit('statusChange', newStatus);
}, { immediate: true });

onMounted(() => {
  checkStatus();
  pollInterval = setInterval(checkStatus, 5000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});

async function checkStatus() {
  try {
    const res = await fetch(`${API_URL}/api/status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    status.value = data.status === 'running' ? 'running' : data.status === 'stopped' ? 'stopped' : data.status;
    errorMsg.value = '';
  } catch (err) {
    status.value = 'error';
    errorMsg.value = 'Backend non raggiungibile';
  }
}

async function start() {
  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/start`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Start failed');
    await checkStatus();
  } catch (err: any) {
    errorMsg.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

async function stop() {
  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/stop`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Stop failed');
    await checkStatus();
  } catch (err: any) {
    errorMsg.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

async function restart() {
  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/restart`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Restart failed');
    await checkStatus();
  } catch (err: any) {
    errorMsg.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

const statusLabel = {
  running: 'Ambiente pronto',
  stopped: 'Ambiente spento',
  not_found: 'Ambiente non creato',
  error: 'Errore connessione',
  loading: 'Controllo...'
};

const statusColor = {
  running: 'bg-green-500',
  stopped: 'bg-gray-400',
  not_found: 'bg-yellow-500',
  error: 'bg-red-500',
  loading: 'bg-blue-400 animate-pulse'
};
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Status dot + label -->
    <div class="flex items-center gap-2">
      <div :class="['w-2.5 h-2.5 rounded-full', statusColor[status]]" />
      <span class="text-xs text-gray-500 hidden sm:inline">{{ statusLabel[status] }}</span>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center gap-1">
      <template v-if="status === 'stopped' || status === 'not_found'">
        <button
          @click="start"
          :disabled="isLoading"
          class="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition-colors"
        >
          {{ isLoading ? 'Avvio...' : 'Avvia' }}
        </button>
      </template>

      <template v-else-if="status === 'running'">
        <button
          @click="restart"
          :disabled="isLoading"
          class="text-xs px-2 py-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded transition-colors"
          title="Riavvia"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>

        <button
          @click="stop"
          :disabled="isLoading"
          class="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded transition-colors"
          title="Ferma"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
          </svg>
        </button>
      </template>
    </div>

    <!-- Error tooltip -->
    <div v-if="errorMsg" class="text-xs text-red-500" :title="errorMsg">
      {{ errorMsg.length > 20 ? errorMsg.slice(0, 20) + '...' : errorMsg }}
    </div>
  </div>
</template>
