package api

type Observation struct {
	ID            int64  `json:"id"`
	SyncID        string `json:"sync_id,omitempty"`
	SessionID     string `json:"session_id"`
	Type          string `json:"type"`
	Title         string `json:"title"`
	Content       string `json:"content"`
	ToolName      string `json:"tool_name,omitempty"`
	Project       string `json:"project,omitempty"`
	Scope         string `json:"scope"`
	TopicKey      string `json:"topic_key,omitempty"`
	RevisionCount int    `json:"revision_count"`
	Pinned        bool   `json:"pinned"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}

type ListResponse struct {
	Items  []Observation `json:"items"`
	Total  int           `json:"total"`
	Limit  int           `json:"limit"`
	Offset int           `json:"offset"`
}

type DistinctResponse struct {
	Items []string `json:"items"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
