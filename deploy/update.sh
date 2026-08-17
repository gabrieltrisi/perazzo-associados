#!/usr/bin/env bash
# Redeploy: puxa o código novo, aplica migrations, rebuilda e recarrega.
# Uso no VPS: bash deploy/update.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ git pull"
git pull origin main

echo "→ dependências"
npm ci

echo "→ prisma (client + migrations)"
npx prisma generate
npx prisma migrate deploy

echo "→ build"
npm run build

echo "→ reload (PM2, zero-downtime)"
pm2 reload perazzo

echo "✅ Deploy concluído."
