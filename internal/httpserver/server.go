package httpserver

import (
	"io/fs"
	"net/http"

	"github.com/0xvarg/engram-feed/internal/api"
)

type HTTPServer struct {
	mux      *http.ServeMux
	addr     string
	handler  *api.Handlers
	staticFS fs.FS
}

// New wires up routes for the JSON API plus, when staticFS is non-nil, the
// embedded frontend build. staticFS may be nil (e.g. in tests) to run the
// API alone. addr is the full listen address (host:port), e.g.
// "127.0.0.1:8080" locally or "0.0.0.0:8080" inside a container.
func New(addr string, handler *api.Handlers, staticFS fs.FS) *HTTPServer {
	srv := &HTTPServer{
		addr:     addr,
		handler:  handler,
		staticFS: staticFS,
	}
	srv.mux = http.NewServeMux()
	srv.routes()
	return srv
}

func (s *HTTPServer) Start() error {
	return http.ListenAndServe(s.addr, s.mux)
}
