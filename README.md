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

## AI-Generated Configuration Audit

The initial application, Dockerfile, and Docker Compose configuration were generated using AI. I reviewed the files against the assignment's container security and performance checklist.

### Findings

**Multi-Stage Build:** The Dockerfile uses two stages with Node.js Alpine. The first stage validates the application code, while the second creates the runtime image. Since the application has no external dependencies, dependency layer caching was not applicable.

**Non-Root Execution:** The Dockerfile specifies `USER node`. Testing with `docker compose exec web id` confirmed that the application runs as UID 1000 rather than root.

**Resource Limits and Health Checks:** Docker Compose includes CPU, memory, and PID limits along with health checks for both the web application and Nginx proxy.

**Image Version Pinning:** The AI-generated configuration used `nginxinc/nginx-unprivileged:stable-alpine`. This floating tag could change between deployments, making builds less reproducible.

### Correction

I replaced the floating Nginx image tag with a specific SHA-256 image digest. This ensures future deployments reference the same image content rather than automatically using a newer image.

After updating `compose.yaml`, I validated the configuration and recreated the Nginx proxy. All four containers returned to a healthy state.

### QA Testing Results

| Test | Result |
|---|---|
| Docker Compose configuration validation | Pass |
| Docker image build | Pass |
| Application landing page | Pass |
| Health endpoint (`/healthz`) | Pass |
| Runtime metadata endpoint (`/metadata`) | Pass |
| Non-root execution (UID 1000) | Pass |
| Scaling to three web replicas | Pass |
| Automatic restart after application process failure | Pass |
| Browser HTTP 200 response | Pass |
| Browser console without errors | Pass |
| Nginx image pinning and redeployment | Pass |

The application passed the completed functional, security, and resilience tests. Docker Compose successfully ran three web replicas behind the Nginx reverse proxy and automatically restarted a container after its application process was forcibly terminated.