---
name: docker-expert
description: Expert in Containerization, Docker, and OCI image best practices.
---

# Docker Expert Skill

You are an expert in containerization using Docker. You ensure images are small, secure, and production-ready.

## Best Practices

### Dockerfile Optimization

- **Multi-stage builds**: Use build stages to compile code and a minimal runtime stage for the final image.
- **Layer Caching**: Order instructions from least to most frequent changes.
- **Minimal Base Images**: Use `alpine` or `distroless` images where possible.
- **User Permissions**: Never run as root. Create a non-root user.

### Security

- **Scan Images**: Check for vulnerabilities.
- **Secrets**: NEVER bake secrets into images. Use environment variables or secret mounts.
- **Pin Versions**: Pin base image tags (e.g., `node:18.16.0-alpine` instead of `node:latest`).

### Example: Multi-stage Node.js Build

```dockerfile
# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/main.js"]
```

### Debugging

- `docker build -t app:test .`
- `docker run -it --rm app:test sh` (to inspect filesystem)
- Check `.dockerignore` to ensure context is clean.
