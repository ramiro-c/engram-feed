FROM golang:1.26.7-alpine AS builder

WORKDIR /app

# Copy go module files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY cmd/ ./cmd/
COPY internal/ ./internal/
COPY web/ ./web/

# Build the Go binary with embedded frontend
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o engram-feed ./cmd/server

# =============================================
# Runtime stage
# =============================================
FROM alpine:3.20

WORKDIR /root/

# Install CA certs
RUN apk add --no-cache ca-certificates

# Copy the binary
COPY --from=builder /app/engram-feed /root/engram-feed

# Copy the embed file (will be populated at build time)
COPY web/embed.go /root/web/embed.go

# The dist directory will be copied at docker build time
# or mounted via docker-compose volume

EXPOSE 8080

ENV PORT=8080
ENV ENGRAM_DSN=/root/.engram/engram.db

CMD ["/root/engram-feed"]