package main

import (
	"context"
	"flag"
	"io/fs"
	"log"
	"net"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"

	"github.com/0xvarg/engram-feed/internal/api"
	"github.com/0xvarg/engram-feed/internal/db"
	"github.com/0xvarg/engram-feed/internal/httpserver"
	"github.com/0xvarg/engram-feed/web"
)

const defaultAddr = "127.0.0.1:8080"

func main() {
	_ = godotenv.Load()

	defaultForAddr := defaultAddr
	if port := os.Getenv("PORT"); port != "" {
		defaultForAddr = "127.0.0.1:" + port
	}

	addr := flag.String("addr", envOrDefault("ENGRAM_FEED_ADDR", defaultForAddr), "address to listen on")
	flag.Parse()

	_, err := addrToPort(*addr)
	if err != nil {
		log.Fatalf("engram-feed: invalid --addr %q: %v", *addr, err)
	}

	sqlDB, err := db.Open()
	if err != nil {
		log.Fatalf("engram-feed: open database: %v", err)
	}
	defer sqlDB.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := sqlDB.PingContext(ctx); err != nil {
		log.Fatalf("engram-feed: database unavailable: %v", err)
	}

	distFS, err := fs.Sub(web.Dist, "dist")
	if err != nil {
		log.Fatalf("engram-feed: load embedded frontend: %v", err)
	}

	handlers := api.New(sqlDB)
	srv := httpserver.New(*addr, handlers, distFS)

	log.Printf("engram-feed: listening on %s", *addr)
	if err := srv.Start(); err != nil {
		log.Fatalf("engram-feed: server error: %v", err)
	}
}

func envOrDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func addrToPort(addr string) (int, error) {
	_, portStr, err := net.SplitHostPort(addr)
	if err != nil {
		return 0, err
	}
	return strconv.Atoi(portStr)
}
