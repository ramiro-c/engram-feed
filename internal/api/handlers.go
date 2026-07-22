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

func jsonResponse(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("write json response: %v", err)
	}
}

func jsonError(w http.ResponseWriter, status int, msg string) {
	jsonResponse(w, status, map[string]string{"error": msg})
}

func jsonErrorWithFields(w http.ResponseWriter, status int, msg string, fields map[string]any) {
	payload := map[string]any{"error": msg}
	for key, value := range fields {
		payload[key] = value
	}
	jsonResponse(w, status, payload)
}

func queryInt(r *http.Request, key string, defaultVal int) int {
	v := r.URL.Query().Get(key)
	if v == "" {
		return defaultVal
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return defaultVal
	}
	return n
}

func queryBool(r *http.Request, key string, defaultVal bool) bool {
	v := r.URL.Query().Get(key)
	if v == "" {
		return defaultVal
	}
	b, err := strconv.ParseBool(v)
	if err != nil {
		return defaultVal
	}
	return b
}

func writeDBError(w http.ResponseWriter, err error) {
	if errors.Is(err, sql.ErrNoRows) {
		jsonError(w, http.StatusNotFound, "not found")
		return
	}
	log.Printf("database error: %v", err)
	jsonError(w, http.StatusServiceUnavailable, "database unavailable")
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

func (h *Handlers) ListObservations(w http.ResponseWriter, r *http.Request) {
	limit := defaultLimit
	if v := r.URL.Query().Get("limit"); v != "" {
		n, err := strconv.Atoi(v)
		if err != nil {
			jsonErrorWithFields(w, http.StatusBadRequest, "invalid limit: must be an integer", map[string]any{"limit": v})
			return
		}
		limit = n
	}
	if limit < 0 {
		jsonErrorWithFields(w, http.StatusBadRequest, "invalid limit: must not be negative", map[string]any{"limit": limit})
		return
	}
	if limit > maxLimit {
		jsonErrorWithFields(w, http.StatusBadRequest, "invalid limit: must not exceed 100", map[string]any{"limit": limit})
		return
	}

	offset := 0
	if v := r.URL.Query().Get("offset"); v != "" {
		n, err := strconv.Atoi(v)
		if err != nil {
			jsonErrorWithFields(w, http.StatusBadRequest, "invalid offset: must be an integer", map[string]any{"offset": v})
			return
		}
		offset = n
	}
	if offset < 0 {
		jsonErrorWithFields(w, http.StatusBadRequest, "invalid offset: must not be negative", map[string]any{"offset": offset})
		return
	}

	q := r.URL.Query()
	filters := db.ListFilters{
		Project:   q.Get("project"),
		Type:      q.Get("type"),
		TopicKey:  q.Get("topic_key"),
		SessionID: q.Get("session_id"),
		Pinned:    queryBool(r, "pinned", false),
		Query:     q.Get("q"),
		Limit:     limit,
		Offset:    offset,
	}

	result, err := db.List(r.Context(), h.DB, filters)
	if err != nil {
		if filters.Query != "" {
			jsonError(w, http.StatusBadRequest, "invalid search query")
			return
		}
		writeDBError(w, err)
		return
	}

	items := make([]Observation, 0, len(result.Items))
	for _, o := range result.Items {
		items = append(items, toAPIObservation(o))
	}

	jsonResponse(w, http.StatusOK, ListResponse{
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
		jsonError(w, http.StatusBadRequest, "invalid id: must be an integer")
		return
	}

	o, err := db.Get(r.Context(), h.DB, id)
	if err != nil {
		writeDBError(w, err)
		return
	}

	jsonResponse(w, http.StatusOK, toAPIObservation(o))
}

func (h *Handlers) ListProjects(w http.ResponseWriter, r *http.Request) {
	values, err := db.Projects(r.Context(), h.DB)
	if err != nil {
		writeDBError(w, err)
		return
	}
	jsonResponse(w, http.StatusOK, DistinctResponse{Items: values})
}

func (h *Handlers) ListTypes(w http.ResponseWriter, r *http.Request) {
	values, err := db.Types(r.Context(), h.DB)
	if err != nil {
		writeDBError(w, err)
		return
	}
	jsonResponse(w, http.StatusOK, DistinctResponse{Items: values})
}
