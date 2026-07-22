package httpserver

import (
	"encoding/json"
	"io/fs"
	"net/http"
)

func (s *HTTPServer) routes() {
	s.mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	if s.handler != nil {
		s.mux.HandleFunc("GET /api/observations", s.handler.ListObservations)
		s.mux.HandleFunc("GET /api/observations/{id}", s.handler.GetObservation)
		s.mux.HandleFunc("GET /api/projects", s.handler.ListProjects)
		s.mux.HandleFunc("GET /api/types", s.handler.ListTypes)
	}

	if s.staticFS != nil {
		s.mux.Handle("/", spaHandler(s.staticFS))
	}
}

// spaHandler serves the embedded SPA build. Requests for a path that has no
// matching embedded file (client-side routes like /observations/123) fall
// back to index.html so preact-iso can take over routing.
func spaHandler(staticFS fs.FS) http.Handler {
	fileServer := http.FileServer(http.FS(staticFS))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, err := fs.Stat(staticFS, "index.html"); err != nil {
			http.Error(w, "frontend not built: run `pnpm build` in web/", http.StatusNotFound)
			return
		}
		if r.URL.Path == "/" {
			fileServer.ServeHTTP(w, r)
			return
		}
		if _, err := fs.Stat(staticFS, r.URL.Path[1:]); err != nil {
			r.URL.Path = "/"
		}
		fileServer.ServeHTTP(w, r)
	})
}
