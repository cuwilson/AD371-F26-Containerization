# Containerized Node.js Web App

## Requirements
- Docker Engine / Docker Desktop with Docker Compose v2

## Start
```bash
cp .env.example .env  # Windows PowerShell: Copy-Item .env.example .env
docker compose config
docker compose up -d --build --scale web=3
docker compose ps
```

Visit <http://localhost:8080/>.

## Test
```bash
curl http://localhost:8080/
curl http://localhost:8080/healthz
curl http://localhost:8080/metadata
```

PowerShell: use `curl.exe` instead of `curl` if your shell maps `curl` to another command.

## Scale
```bash
docker compose up -d --scale web=5
docker compose ps
```

## Logs and stop
```bash
docker compose logs -f web
docker compose down
```

## Notes
- Nginx is the only host-published port. It binds to 127.0.0.1, intentionally restricting remote access.
- Each replica has a distinct container hostname and startup time; query `/metadata` repeatedly to observe it.
- Nginx uses Docker embedded DNS to resolve backend replicas. This is a lightweight Compose demonstration, not a cross-host orchestrator.
- The container does not run as root; filesystem is read-only, Linux capabilities are dropped, and CPU/memory/PID limits are configured.
- `.env` is a local configuration example, not a secret store. The Compose example reads it as environment variables for the application and for public port interpolation.
- Production internet deployment additionally needs TLS termination, authentication if relevant, observability, an image vulnerability scanning and update process, and hardened host/network setup.
