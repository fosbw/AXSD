CREATE TABLE IF NOT EXISTS audit_events (sequence_id BIGSERIAL PRIMARY KEY, event_id TEXT NOT NULL UNIQUE, actor_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT, action TEXT NOT NULL, execution_id TEXT, resource_id TEXT, metadata JSONB NOT NULL DEFAULT '{}'::jsonb, previous_hash TEXT NOT NULL DEFAULT '', integrity_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS audit_events_created_idx ON audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_events_actor_idx ON audit_events(actor_id,created_at DESC);
