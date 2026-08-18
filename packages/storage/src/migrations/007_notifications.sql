CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,type TEXT NOT NULL,title TEXT NOT NULL,body TEXT NOT NULL,read_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications(user_id,read_at,created_at DESC);
