package httpserver

import (
	"fmt"
	"net/http"

	"github.com/0xvarg/engram-feed/internal/api"
)

type HTTPServer struct {
	mux     *http.ServeMux
	port    int
	handler *api.Handlers
}

func New(port int, handler *api.Handlers) *HTTPServer {
	srv := &HTTPServer{
		port:    port,
		handler: handler,
	}
	srv.mux = http.NewServeMux()
	srv.routes()
	return srv
}

func (s *HTTPServer) Start() error {
	addr := fmt.Sprintf("127.0.0.1:%d", s.port)
	return http.ListenAndServe(addr, s.mux)
}
