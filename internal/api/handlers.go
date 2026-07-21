package api

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/0xvarg/engram-feed/internal/db"
)

const (
	defaultLimit = 50
	maxLimit     = 100
)

type Handlers struct {
	DB *sql.DB
}

func New(sqlDB *sql.DB) *Handlers {
	return &Handlers{DB: sqlDB}
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Printf("write json response: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, ErrorResponse{Error: message})
}

func writeDBError(w http.ResponseWriter, err error) {
	if errors.Is(err, sql.ErrNoRows) {
		writeError(w, http.StatusNotFound, "not found")
		return
	}
	log.Printf("database error: %v", err)
	writeError(w, http.StatusServiceUnavailable, "database unavailable")
}

func toAPIObservation(o db.Observation) Observation {
	return Observation{
		ID:            o.ID,
		SyncID:        o.SyncID.String,
		SessionID:     o.SessionID,
		Type:          o.Type,
		Title:         o.Title,
		Content:       o.Content,
		ToolName:      o.ToolName.String,
		Project:       o.Project.String,
		Scope:         o.Scope,
		TopicKey:      o.TopicKey.String,
		RevisionCount: o.RevisionCount,
		Pinned:        o.Pinned,
		CreatedAt:     o.CreatedAt,
		UpdatedAt:     o.UpdatedAt,
	}
}

func parseIntParam(r *http.Request, name string, defaultVal int) (int, error) {
	raw := r.URL.Query().Get(name)
	if raw == "" {
		return defaultVal, nil
	}
	v, err := strconv.Atoi(raw)
	if err != nil {
		return 0, errors.New("invalid " + name + ": must be an integer")
	}
	if v < 0 {
		return 0, errors.New("invalid " + name + ": must not be negative")
	}
	return v, nil
}

func (h *Handlers) ListObservations(w http.ResponseWriter, r *http.Request) {
	limit, err := parseIntParam(r, "limit", defaultLimit)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if limit > maxLimit {
		writeError(w, http.StatusBadRequest, "invalid limit: must not exceed 100")
		return
	}

	offset, err := parseIntParam(r, "offset", 0)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	q := r.URL.Query()
	filters := db.ListFilters{
		Project:  q.Get("project"),
		Type:     q.Get("type"),
		TopicKey: q.Get("topic_key"),
		Query:    q.Get("q"),
		Limit:    limit,
		Offset:   offset,
	}

	result, err := db.List(r.Context(), h.DB, filters)
	if err != nil {
		if filters.Query != "" {
			// A non-empty q that fails is treated as a malformed filter
			// param per spec, not a DB-unavailable condition.
			writeError(w, http.StatusBadRequest, "invalid search query")
			return
		}
		writeDBError(w, err)
		return
	}

	items := make([]Observation, 0, len(result.Items))
	for _, o := range result.Items {
		items = append(items, toAPIObservation(o))
	}

	writeJSON(w, http.StatusOK, ListResponse{
		Items:  items,
		Total:  result.Total,
		Limit:  limit,
		Offset: offset,
	})
}

func (h *Handlers) GetObservation(w http.ResponseWriter, r *http.Request) {
	idParam := r.PathValue("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid id: must be an integer")
		return
	}

	o, err := db.Get(r.Context(), h.DB, id)
	if err != nil {
		writeDBError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, toAPIObservation(o))
}

func (h *Handlers) ListProjects(w http.ResponseWriter, r *http.Request) {
	values, err := db.Projects(r.Context(), h.DB)
	if err != nil {
		writeDBError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, DistinctResponse{Items: values})
}

func (h *Handlers) ListTypes(w http.ResponseWriter, r *http.Request) {
	values, err := db.Types(r.Context(), h.DB)
	if err != nil {
		writeDBError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, DistinctResponse{Items: values})
}
