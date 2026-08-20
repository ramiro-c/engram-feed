# syntax=docker/dockerfile:1

FROM node:24-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY vite.config.ts tsconfig*.json ./
COPY src/ ./src/
COPY index.html ./

# Validate that the frontend builds (also produces dist for potential prod use).
RUN pnpm build

# ── Runtime: Vite dev server with hot reload ──
FROM node:24-alpine AS web-runtime
WORKDIR /app

# pnpm binary needed for CMD; deps themselves are reused from builder
RUN npm install -g pnpm && apk add --no-cache wget

# Reuse installed deps instead of reinstalling — saves ~60s and a layer
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./index.html
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/vite.config.ts ./vite.config.ts
# Vite dev serves SOURCE, not dist: src/ + tsconfigs are required
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.app.json ./tsconfig.app.json
COPY --from=builder /app/tsconfig.node.json ./tsconfig.node.json
COPY --from=builder /app/src ./src

EXPOSE 5173

# Default API target for local dev (outside Docker); overridden in docker-compose
ENV VITE_API_TARGET=http://localhost:8080

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
