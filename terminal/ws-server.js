const WebSocket = require('ws');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3001;
const CONTAINER_NAME = process.env.CONTAINER_NAME || 'devtrack-terminal';

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server listening on port ${PORT}`);
console.log(`Bridging to container: ${CONTAINER_NAME}`);

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Spawn a bash shell inside the terminal container
  const shell = spawn('docker', [
    'exec', '-i', CONTAINER_NAME,
    'su', '-', 'devtrack', '-c', 'bash -l'
  ], {
    detached: false,
  });

  // Forward stdout/stderr from shell to WebSocket
  shell.stdout.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data.toString('utf-8'));
    }
  });

  shell.stderr.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data.toString('utf-8'));
    }
  });

  // Forward WebSocket messages to shell stdin
  ws.on('message', (message) => {
    if (shell.stdin.writable) {
      shell.stdin.write(message.toString());
    }
  });

  // Cleanup on disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    shell.kill('SIGKILL');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    shell.kill('SIGKILL');
  });

  // Handle shell exit
  shell.on('exit', (code) => {
    console.log(`Shell exited with code ${code}`);
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  wss.clients.forEach((ws) => ws.close());
  wss.close(() => {
    process.exit(0);
  });
});
