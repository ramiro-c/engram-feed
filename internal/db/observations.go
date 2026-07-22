package db

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
)

const observationColumns = `o.id, o.sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, ` +
	`o.project, o.scope, o.topic_key, o.revision_count, o.pinned, o.created_at, o.updated_at`

type Observation struct {
	ID            int64
	SyncID        sql.NullString
	SessionID     string
	Type          string
	Title         string
	Content       string
	ToolName      sql.NullString
	Project       sql.NullString
	Scope         string
	TopicKey      sql.NullString
	RevisionCount int
	Pinned        bool
	CreatedAt     string
	UpdatedAt     string
}

type ListFilters struct {
	Project   string
	Type      string
	TopicKey  string
	SessionID string
	Query     string
	Limit     int
	Offset    int
}

type ListResult struct {
	Items []Observation
	Total int
}

func scanObservation(row interface{ Scan(...any) error }) (Observation, error) {
	var o Observation
	err := row.Scan(
		&o.ID, &o.SyncID, &o.SessionID, &o.Type, &o.Title, &o.Content, &o.ToolName,
		&o.Project, &o.Scope, &o.TopicKey, &o.RevisionCount, &o.Pinned, &o.CreatedAt, &o.UpdatedAt,
	)
	return o, err
}

func List(ctx context.Context, sqlDB *sql.DB, f ListFilters) (ListResult, error) {
	var (
		whereClauses []string
		args         []any
	)

	base := "FROM observations o WHERE o.deleted_at IS NULL"

	if f.Project != "" {
		whereClauses = append(whereClauses, "o.project = ?")
		args = append(args, f.Project)
	}
	if f.Type != "" {
		whereClauses = append(whereClauses, "o.type = ?")
		args = append(args, f.Type)
	}
	if f.TopicKey != "" {
		whereClauses = append(whereClauses, "o.topic_key = ?")
		args = append(args, f.TopicKey)
	}
	if f.SessionID != "" {
		whereClauses = append(whereClauses, "o.session_id = ?")
		args = append(args, f.SessionID)
	}

	fromClause := base
	if f.Query != "" {
		sanitized, err := sanitizeFTSQuery(f.Query)
		if err != nil {
			return ListResult{}, err
		}
		fromClause = "FROM observations o " +
			"JOIN observations_fts ON observations_fts.rowid = o.id " +
			"WHERE o.deleted_at IS NULL AND observations_fts MATCH ?"
		args = append([]any{sanitized}, args...)
	}

	where := ""
	if len(whereClauses) > 0 {
		where = " AND " + strings.Join(whereClauses, " AND ")
	}

	countQuery := "SELECT COUNT(*) " + fromClause + where
	var total int
	if err := sqlDB.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return ListResult{}, fmt.Errorf("count observations: %w", err)
	}

	limit := f.Limit
	if limit <= 0 {
		limit = 50
	}
	offset := f.Offset
	if offset < 0 {
		offset = 0
	}

	listQuery := fmt.Sprintf(
		"SELECT %s %s%s ORDER BY o.created_at DESC LIMIT ? OFFSET ?",
		observationColumns, fromClause, where,
	)
	listArgs := append(append([]any{}, args...), limit, offset)

	rows, err := sqlDB.QueryContext(ctx, listQuery, listArgs...)
	if err != nil {
		return ListResult{}, fmt.Errorf("list observations: %w", err)
	}
	defer rows.Close()

	items := make([]Observation, 0, limit)
	for rows.Next() {
		o, err := scanObservation(rows)
		if err != nil {
			return ListResult{}, fmt.Errorf("scan observation: %w", err)
		}
		items = append(items, o)
	}
	if err := rows.Err(); err != nil {
		return ListResult{}, fmt.Errorf("iterate observations: %w", err)
	}

	return ListResult{Items: items, Total: total}, nil
}

func Get(ctx context.Context, sqlDB *sql.DB, id int64) (Observation, error) {
	query := fmt.Sprintf(
		"SELECT %s FROM observations o WHERE o.id = ? AND o.deleted_at IS NULL",
		observationColumns,
	)
	row := sqlDB.QueryRowContext(ctx, query, id)
	return scanObservation(row)
}

func Projects(ctx context.Context, sqlDB *sql.DB) ([]string, error) {
	return distinctColumn(ctx, sqlDB, "project")
}

func Types(ctx context.Context, sqlDB *sql.DB) ([]string, error) {
	return distinctColumn(ctx, sqlDB, "type")
}

func distinctColumn(ctx context.Context, sqlDB *sql.DB, column string) ([]string, error) {
	query := fmt.Sprintf(
		"SELECT DISTINCT %s FROM observations WHERE deleted_at IS NULL AND %s IS NOT NULL AND %s != '' ORDER BY %s",
		column, column, column, column,
	)

	rows, err := sqlDB.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list distinct %s: %w", column, err)
	}
	defer rows.Close()

	values := make([]string, 0)
	for rows.Next() {
		var v string
		if err := rows.Scan(&v); err != nil {
			return nil, fmt.Errorf("scan distinct %s: %w", column, err)
		}
		values = append(values, v)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate distinct %s: %w", column, err)
	}

	return values, nil
}

func sanitizeFTSQuery(q string) (string, error) {
	trimmed := strings.TrimSpace(q)
	if trimmed == "" {
		return "", fmt.Errorf("empty search query")
	}
	escaped := strings.ReplaceAll(trimmed, `"`, `""`)
	return `"` + escaped + `"`, nil
}
