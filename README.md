# Engram Feed

A read-only, social-media-style feed for browsing the local SQLite memory of [Engram](https://github.com/Gentleman-Programming/engram), the persistent memory system for AI coding agents (agent-agnostic Go binary with SQLite + FTS5, MCP server, HTTP API, CLI, and TUI). Engram Feed takes what it stored and shows it as a Twitter/X-style timeline instead of raw MCP tool calls or a JSON dump.

## Why

Engram already ships a CLI and a TUI to inspect its memory, and this isn't meant to replace either of them. It's a small side project born out of curiosity: what would that memory look like with a more human, less terminal-shaped face? So Engram Feed gives it one, a scrollable, social-media-style timeline instead of rows in a table.

It's intentionally small in scope:

- **Read-only.** The app never writes to Engram's database. The SQLite connection is opened with `mode=ro` and `query_only(1)` at the driver level, not just by convention.
- **Manual refresh.** No live-tail, no polling, no websockets. You reload when you want to see new data.
- **All projects by default.** No single-project lock-in; the feed spans every project Engram has observations for, with quick filters layered on top.

## Features

- Feed of observations grouped by session. Related observations from the same session collapse into a reply-style thread instead of repeating as standalone posts.
- Full-text search (SQLite FTS5) over observation content.
- Quick filters: project, type, pinned-only, and topic (click any `#tag` to filter by that observation's exact `topic_key`).
- A detail page per observation with the full, Markdown-rendered content plus everything else from that session.
- Ships as a single self-contained binary. The built frontend gets embedded into the Go binary via `embed.FS`, so there's nothing to deploy but one executable.

## Requirements

- [Go](https://go.dev/) 1.26+
- [Node.js](https://nodejs.org/) 20+ and [pnpm](https://pnpm.io/)
- An existing Engram database at `~/.engram/engram.db` (or point `ENGRAM_DSN` elsewhere, see below)

No CGO, no system SQLite. The Go side uses [`modernc.org/sqlite`](https://pkg.go.dev/modernc.org/sqlite), a pure-Go driver, so `go build` alone produces a portable binary.

## Configuration

Copy `.env.example` to `.env` and adjust as needed:

| Variable     | Default               | Description                                                                                                  |
| ------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `PORT`       | `8080`                 | Port the server listens on.                                                                                  |
| `ENGRAM_DSN` | `~/.engram/engram.db`  | Path to Engram's SQLite file. A bare path, not a DSN. The app builds the read-only connection string itself. |

## Running in development

Two processes, two terminals:

```bash
# terminal 1: API server
go run ./cmd/server

# terminal 2: frontend with hot reload, proxies /api to :8080
cd web
pnpm install
pnpm dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## Building the single binary

```bash
cd web
pnpm install
pnpm build        # outputs web/dist, embedded by the Go build below

cd ..
go build -o engram-feed ./cmd/server
./engram-feed
```

The frontend has to be built **before** `go build`. `web/embed.go` embeds whatever is in `web/dist` at compile time. After that, everything runs from one process on one port: the API under `/api/*` and the SPA everywhere else.

## API

All endpoints are read-only `GET`s.

| Endpoint                 | Notes                                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `/api/observations`      | Paginated (`limit`/`offset`), filterable by `project`, `type`, `topic_key`, `session_id`, `pinned`, `q` (full-text search). |
| `/api/observations/{id}` | A single observation.                                                                                                       |
| `/api/projects`          | Distinct project values, for filter UIs.                                                                                    |
| `/api/types`             | Distinct observation types, for filter UIs.                                                                                 |
| `/health`                | Liveness check.                                                                                                             |

## Project structure

```
cmd/server/       entrypoint: wiring, flags, startup
internal/db/      read-only SQLite access, query building, FTS sanitizing
internal/api/     HTTP handlers, request/response DTOs
internal/httpserver/  routing, embedded-SPA static serving
web/              Preact + Vite frontend
web/embed.go      go:embed shim that pulls web/dist into the Go binary
```

## Acknowledgments

- [Engram](https://github.com/Gentleman-Programming/engram), the persistent memory system for AI coding agents this project reads from.
- [modernc.org/sqlite](https://pkg.go.dev/modernc.org/sqlite), the pure-Go SQLite driver that lets this ship as one binary with no CGO.
- [Preact](https://preactjs.com/) and [preact-iso](https://preactjs.com/guide/v10/preact-iso/), the frontend runtime and router.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [marked](https://marked.js.org/) and [DOMPurify](https://github.com/cure53/DOMPurify) for safe Markdown rendering.
- [lucide](https://lucide.dev/) for icons.
