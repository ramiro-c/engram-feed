# syntax=docker/dockerfile:1

# ── Stage 1: build frontend (dist) so Go embed has real content ──
FROM node:24-alpine AS web-builder
WORKDIR /app

RUN npm install -g pnpm

COPY web/package.json web/pnpm-lock.yaml ./web/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    cd web && pnpm install --frozen-lockfile

COPY web/ ./web/
RUN cd web && pnpm build

# ── Stage 2: build Go binary with embedded dist ──
FROM golang:1.26.7-alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd/ ./cmd/
COPY internal/ ./internal/
# embed shim + built dist (embed.go does //go:embed all:dist)
COPY web/embed.go ./web/embed.go
COPY --from=web-builder /app/web/dist ./web/dist

RUN CGO_ENABLED=0 GOOS=linux go build -o engram-feed ./cmd/server

# ── Stage 3: runtime ──
FROM alpine:3.20
WORKDIR /root/

RUN apk add --no-cache ca-certificates wget

COPY --from=builder /app/engram-feed /root/engram-feed

EXPOSE 8080

ENV ENGRAM_DSN=/root/.engram/engram.db

CMD ["/root/engram-feed"]
