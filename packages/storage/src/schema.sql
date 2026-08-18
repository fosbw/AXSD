-- Canonical reference schema. Production uses numbered migrations in ./migrations/.
-- Keep this file aligned with the latest migration set for inspection/documentation.

CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,display_name TEXT NOT NULL,role TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY,owner_id TEXT REFERENCES users(id),name TEXT NOT NULL,instructions TEXT,status TEXT NOT NULL DEFAULT 'ACTIVE',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),project_id TEXT REFERENCES projects(id),status TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS resources (id TEXT PRIMARY KEY,name TEXT NOT NULL,type TEXT NOT NULL,provider TEXT NOT NULL,version TEXT,capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,status TEXT NOT NULL,health TEXT NOT NULL,source TEXT NOT NULL,adapter TEXT NOT NULL,metadata JSONB NOT NULL DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),last_seen TIMESTAMPTZ);
