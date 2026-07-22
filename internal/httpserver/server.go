package httpserver

import (
	"fmt"
	"io/fs"
	"net/http"

	"github.com/0xvarg/engram-feed/internal/api"
)

type HTTPServer struct {
	mux      *http.ServeMux
	port     int
	handler  *api.Handlers
	staticFS fs.FS
}

// New wires up routes for the JSON API plus, when staticFS is non-nil, the
// embedded frontend build. staticFS may be nil (e.g. in tests) to run the
// API alone.
func New(port int, handler *api.Handlers, staticFS fs.FS) *HTTPServer {
	srv := &HTTPServer{
		port:     port,
		handler:  handler,
		staticFS: staticFS,
	}
	srv.mux = http.NewServeMux()
	srv.routes()
	return srv
}

func (s *HTTPServer) Start() error {
	addr := fmt.Sprintf("127.0.0.1:%d", s.port)
	return http.ListenAndServe(addr, s.mux)
}
