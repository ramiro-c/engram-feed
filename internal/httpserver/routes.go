package httpserver

import (
	"encoding/json"
	"net/http"
)

func (s *HTTPServer) routes() {
	s.mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	if s.handler == nil {
		return
	}

	s.mux.HandleFunc("GET /api/observations", s.handler.ListObservations)
	s.mux.HandleFunc("GET /api/observations/{id}", s.handler.GetObservation)
	s.mux.HandleFunc("GET /api/projects", s.handler.ListProjects)
	s.mux.HandleFunc("GET /api/types", s.handler.ListTypes)
}
