BEGIN;
CREATE TABLE IF NOT EXISTS notifications(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,type TEXT NOT NULL,title TEXT NOT NULL,body TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),read_at TIMESTAMPTZ);
CREATE INDEX IF NOT EXISTS notifications_user_created_idx ON notifications(user_id,created_at DESC);
CREATE TABLE IF NOT EXISTS execution_leases(execution_id TEXT PRIMARY KEY,worker_id TEXT NOT NULL,expires_at TIMESTAMPTZ NOT NULL,updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS execution_leases_expiry_idx ON execution_leases(expires_at);
INSERT INTO schema_migrations(version) VALUES ('010_operational_hardening') ON CONFLICT DO NOTHING;
COMMIT;
