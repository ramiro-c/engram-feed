FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY vite.config.ts tsconfig*.json ./
COPY src/ ./src/
COPY index.html ./

# Build the frontend
RUN pnpm build

# =============================================
# Runtime stage
# =============================================
FROM node:24-alpine AS web-runtime

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/vite.config.ts ./
# Vite dev serves SOURCE, not dist: src/ + tsconfigs are required
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.app.json ./
COPY --from=builder /app/tsconfig.node.json ./
COPY --from=builder /app/src ./src

# Install pnpm natively in the runtime image (creates the real package + symlink)
# Full install: vite is a devDependency and the dev server needs ALL deps
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Expose Vite dev server port
EXPOSE 5173

# Default API target for local dev (outside Docker); overridden in docker-compose
ENV VITE_API_TARGET=http://localhost:8080

# Run dev server, exposed on all interfaces so the port mapping works
CMD ["pnpm", "dev", "--host", "0.0.0.0"]