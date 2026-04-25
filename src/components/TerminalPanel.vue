<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';

const props = defineProps<{
  url: string;
}>();

const terminalRef = ref<HTMLDivElement | null>(null);
let term: Terminal | null = null;
let ws: WebSocket | null = null;
let fitAddon: FitAddon | null = null;
const isConnected = ref(false);
const isConnecting = ref(true);
const error = ref('');

onMounted(async () => {
  await nextTick();
  if (!terminalRef.value) return;

  term = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      cursor: '#d4d4d4',
      selectionBackground: '#264f78',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#11a8cd',
      white: '#e5e5e5',
    },
    scrollback: 10000,
    allowProposedApi: true,
  });

  fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.loadAddon(new WebLinksAddon());

  term.open(terminalRef.value);
  fitAddon.fit();

  // Connect WebSocket
  connectWebSocket();

  // Handle resize
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  ws?.close();
  term?.dispose();
});

function connectWebSocket() {
  isConnecting.value = true;
  error.value = '';

  try {
    ws = new WebSocket(props.url);

    ws.onopen = () => {
      isConnected.value = true;
      isConnecting.value = false;
      term?.writeln('\r\n\x1b[32mConnected to terminal sandbox\x1b[0m\r\n');
    };

    ws.onmessage = (event) => {
      if (term) {
        term.write(event.data);
      }
    };

    ws.onclose = () => {
      isConnected.value = false;
      isConnecting.value = false;
      term?.writeln('\r\n\x1b[31mConnection closed\x1b[0m');
    };

    ws.onerror = (_err) => {
      isConnected.value = false;
      isConnecting.value = false;
      error.value = 'Failed to connect to terminal server';
      term?.writeln('\r\n\x1b[31mConnection error\x1b[0m');
    };

    // Forward terminal input to WebSocket
    term?.onData((data) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  } catch (err) {
    isConnecting.value = false;
    error.value = 'Failed to create WebSocket connection';
  }
}

function onResize() {
  fitAddon?.fit();
  // Optionally notify server of resize
  // const { cols, rows } = term!;
  // ws?.send(JSON.stringify({ type: 'resize', cols, rows }));
}

function reconnect() {
  ws?.close();
  connectWebSocket();
}
</script>

<template>
  <div class="rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e]">
    <!-- Terminal toolbar -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div class="flex items-center gap-2">
        <div
          :class="[
            'w-2.5 h-2.5 rounded-full',
            isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'
          ]"
        />
        <span class="text-xs text-gray-400 font-medium">
          {{ isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected' }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="!isConnected && !isConnecting"
          @click="reconnect"
          class="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Reconnect
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="px-4 py-2 bg-red-900/30 text-red-400 text-sm border-b border-red-800">
      {{ error }}
    </div>

    <!-- Terminal container -->
    <div ref="terminalRef" class="p-2" style="min-height: 300px;" />
  </div>
</template>
