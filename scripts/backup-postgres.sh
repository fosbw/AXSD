#!/usr/bin/env sh
set -eu
: "${DATABASE_URL:?DATABASE_URL is required}"
OUT="${1:-axsd-backup-$(date -u +%Y%m%dT%H%M%SZ).dump}"
pg_dump --format=custom --no-owner --no-privileges "$DATABASE_URL" > "$OUT"
printf 'backup written to %s\n' "$OUT"
