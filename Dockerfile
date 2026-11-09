# Stage 1: validate the application; no build tooling ships in the runtime image.
FROM node:24-alpine AS build
WORKDIR /build
COPY app/ ./app/
RUN node --check app/server.js && node --check app/healthcheck.js

# Stage 2: minimal runtime image, running as the unprivileged built-in node user.
FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /build/app/ ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "/app/healthcheck.js"]
CMD ["node", "/app/server.js"]
