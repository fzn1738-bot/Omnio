#!/usr/bin/env bash
# Boots the full Omnio stack as a single live service for the in-Claude deployment:
# Postgres -> schema -> seed -> build (frontend + API) -> production server.
# Idempotent and safe to re-run. The Express server serves both the SPA and /api
# on $PORT (default 5000), so the preview pane just needs that one port.
set -uo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-5000}"
export PORT
export NODE_ENV="${NODE_ENV:-production}"
export DATABASE_URL="${DATABASE_URL:-postgresql://omnio:omnio@127.0.0.1:5432/omnio}"
LOG=/tmp/omnio.log

echo "[omnio] starting Postgres..."
pg_ctlcluster 16 main start 2>/dev/null || true
for i in $(seq 1 15); do pg_isready -h 127.0.0.1 -q && break; sleep 1; done

echo "[omnio] ensuring role + database..."
su postgres -c "psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='omnio'\"" 2>/dev/null | grep -q 1 \
  || su postgres -c "psql -c \"CREATE ROLE omnio WITH LOGIN PASSWORD 'omnio' SUPERUSER;\"" 2>/dev/null || true
su postgres -c "psql -tAc \"SELECT 1 FROM pg_database WHERE datname='omnio'\"" 2>/dev/null | grep -q 1 \
  || su postgres -c "psql -c \"CREATE DATABASE omnio OWNER omnio;\"" 2>/dev/null || true

echo "[omnio] installing deps..."
pnpm install --prefer-offline --silent || pnpm install

echo "[omnio] pushing schema + seeding..."
pnpm --filter @workspace/db run push
pnpm --filter @workspace/scripts run seed
pnpm --filter @workspace/scripts run seed:demo

echo "[omnio] building frontend + API..."
PORT="$PORT" BASE_PATH=/ pnpm --filter @workspace/voice-platform exec vite build --config vite.config.ts
pnpm --filter @workspace/api-server run build

echo "[omnio] (re)starting server on :$PORT..."
pkill -f "api-server/dist/index.mjs" 2>/dev/null || true
sleep 1
nohup node --enable-source-maps artifacts/api-server/dist/index.mjs > "$LOG" 2>&1 &
sleep 3
if curl -sf -o /dev/null "http://127.0.0.1:$PORT/"; then
  echo "[omnio] live at http://127.0.0.1:$PORT  (logs: $LOG)"
else
  echo "[omnio] server did not respond yet; check $LOG"; tail -n 20 "$LOG" 2>/dev/null || true
fi
