// Package web embeds the built Preact SPA so the Go binary can serve it
// without any external files. Run `pnpm build` in this directory before
// `go build` — the dist/ output is what gets embedded.
package web

import "embed"

//go:embed all:dist
var Dist embed.FS
