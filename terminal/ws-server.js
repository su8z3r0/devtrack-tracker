const express = require('express');
const cors = require('cors');
const Docker = require('dockerode');
const WebSocket = require('ws');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3001;
const CONTAINER_NAME = process.env.CONTAINER_NAME || 'devtrack-terminal';
const COMPOSE_FILE = process.env.COMPOSE_FILE || '/app/docker-compose.yml';

// Docker client
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Express app
const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Get container status
app.get('/api/status', async (_req, res) => {
  try {
    const container = docker.getContainer(CONTAINER_NAME);
    const info = await container.inspect();
    const isRunning = info.State.Running;
    res.json({
      status: isRunning ? 'running' : 'stopped',
      container: CONTAINER_NAME,
      details: isRunning ? {
        startedAt: info.State.StartedAt,
        health: info.State.Health?.Status || null
      } : null
    });
  } catch (err) {
    if (err.statusCode === 404) {
      res.json({ status: 'not_found', container: CONTAINER_NAME });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Start container via docker-compose
app.post('/api/start', async (_req, res) => {
  try {
    const container = docker.getContainer(CONTAINER_NAME);
    try {
      const info = await container.inspect();
      if (info.State.Running) {
        return res.json({ status: 'already_running', container: CONTAINER_NAME });
      }
      await container.start();
      return res.json({ status: 'started', container: CONTAINER_NAME });
    } catch (err) {
      if (err.statusCode === 404) {
        // Container does not exist, run docker-compose up
        const proc = spawn('docker-compose', ['-f', COMPOSE_FILE, 'up', '-d', 'terminal'], {
          stdio: 'pipe'
        });
        let stdout = '';
        let stderr = '';
        proc.stdout.on('data', (data) => { stdout += data; });
        proc.stderr.on('data', (data) => { stderr += data; });
        proc.on('close', (code) => {
          if (code === 0) {
            res.json({ status: 'created_and_started', container: CONTAINER_NAME });
          } else {
            res.status(500).json({ error: 'docker-compose failed', stderr, stdout });
          }
        });
        return;
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop container
app.post('/api/stop', async (_req, res) => {
  try {
    const container = docker.getContainer(CONTAINER_NAME);
    const info = await container.inspect();
    if (!info.State.Running) {
      return res.json({ status: 'already_stopped', container: CONTAINER_NAME });
    }
    await container.stop();
    res.json({ status: 'stopped', container: CONTAINER_NAME });
  } catch (err) {
    if (err.statusCode === 404) {
      return res.json({ status: 'not_found', container: CONTAINER_NAME });
    }
    res.status(500).json({ error: err.message });
  }
});

// Restart container
app.post('/api/restart', async (_req, res) => {
  try {
    const container = docker.getContainer(CONTAINER_NAME);
    await container.restart();
    res.json({ status: 'restarted', container: CONTAINER_NAME });
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ error: 'Container not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`REST API listening on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket server on ws://0.0.0.0:${PORT}`);
  console.log(`Target container: ${CONTAINER_NAME}`);
});

// WebSocket server attached to HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Spawn a bash shell inside the terminal container
  const shell = spawn('docker', [
    'exec', '-i', CONTAINER_NAME,
    'su', '-', 'devtrack', '-c', 'bash -l'
  ], {
    detached: false,
  });

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

  ws.on('message', (message) => {
    if (shell.stdin.writable) {
      shell.stdin.write(message.toString());
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    shell.kill('SIGKILL');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    shell.kill('SIGKILL');
  });

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
    server.close(() => {
      process.exit(0);
    });
  });
});
