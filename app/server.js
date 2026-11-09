'use strict';

const http = require('node:http');
const os = require('node:os');

const PORT = 3000;
const HOST = '0.0.0.0';
const startedAt = Date.now();
let shuttingDown = false;

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (req.method !== 'GET') {
    res.writeHead(405, { Allow: 'GET' });
    return res.end();
  }

  if (path === '/healthz') {
    return sendJson(res, shuttingDown ? 503 : 200, { status: shuttingDown ? 'stopping' : 'ok' });
  }

  if (path === '/metadata') {
    return sendJson(res, 200, {
      hostname: os.hostname(),
      processId: process.pid,
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'production',
    });
  }

  if (path === '/') {
    const body = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Containerized Web App</title>
<style>body{font:1rem system-ui,sans-serif;max-width:42rem;margin:5rem auto;padding:0 1.2rem;line-height:1.6}a{color:#1261a0}</style></head>
<body><h1>Containerized Web App</h1><p>Node.js running in Docker Compose behind Nginx.</p>
<p><a href="/healthz">Health check</a> · <a href="/metadata">Runtime metadata</a></p></body></html>`;
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'X-Content-Type-Options': 'nosniff',
    });
    return res.end(body);
  }

  return sendJson(res, 404, { error: 'Not found' });
});

server.requestTimeout = 10_000;
server.headersTimeout = 5_000;
server.keepAliveTimeout = 5_000;
server.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT} (${os.hostname()})`);
});

function gracefulShutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  server.close((error) => {
    if (error) console.error(error);
    process.exit(error ? 1 : 0);
  });
  setTimeout(() => process.exit(1), 8_000).unref();
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
