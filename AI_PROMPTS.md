# AI Prompt Log

## Overview

This project began with an AI-generated Node.js application, Dockerfile, and Docker Compose configuration. I reviewed the generated files, tested their functionality, and corrected configuration issues identified during the audit.

## Prompt 1: Initial Application Generation

**Purpose:** Generate a lightweight web application with containerization and orchestration support.

**AI Tool:** ChatGPT

**Original Prompt:**

```
Act as a senior DevOps and cloud infrastructure architect. I need to containerize and orchestrate a lightweight web application (e.g., Node.js, Python FastAPI, or Go).

The deliverable must include:

A production-ready Dockerfile:
   - Uses a lightweight base image (e.g., Alpine or Distroless).

   - Implements a multi-stage build to keep the final image minimal.

   - Follows security best practices (e.g., runs as a non-root user, minimal layers, no cached package manager files).

   - Exposes a health check endpoint (/healthz).

An Orchestration Manifest:
   - Docker Compose: Multi-replica web service with CPU/memory limits, health checks, restart policies, and an environment file (.env).


Minimal Application Code:
   - A basic web server with a landing page, a health-check endpoint (/healthz), and an endpoint displaying server runtime metadata (e.g., hostname/container ID and uptime).

 

Provide the Dockerfile, the orchestration YAML files, the application code, and clear terminal commands to build, run, and scale the system.
```

**Generated Artifacts:**
- Node.js web server with `/`, `/healthz`, and `/metadata` endpoints
- Multi-stage Dockerfile
- Docker Compose configuration
- Nginx reverse proxy configuration
- Environment configuration example
- Initial README documentation

## AI Output Review and Corrections

### Issue 1: Floating Nginx Image Tag

**Original Configuration:**

`nginxinc/nginx-unprivileged:stable-alpine`

**Problem:**

The AI-generated configuration used a floating image tag. This could result in different Nginx versions being downloaded during future deployments.

**Correction:**

Replaced the floating tag with the SHA-256 digest of the tested Nginx image.

**Verification:**

Validated the Docker Compose configuration, recreated the proxy container, and confirmed that all four containers were healthy.

## Testing and Verification

I tested the application using Docker Compose and browser Developer Tools.

The tests included:
- Building and inspecting the Docker image
- Confirming non-root execution
- Testing application endpoints
- Scaling to three web replicas
- Simulating application failure and confirming automatic restart
- Checking HTTP responses and browser console errors

The completed tests passed.