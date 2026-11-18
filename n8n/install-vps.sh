#!/usr/bin/env bash
set -euo pipefail

echo "============================================================"
echo "  OZ DIGITAL // Instalador Local n8n + PostgreSQL na VPS"
echo "============================================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Verifica Docker
if ! command -v docker &> /dev/null; then
  echo "[1/4] Docker não encontrado. Instalando Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo systemctl enable docker
  sudo systemctl start docker
else
  echo "[1/4] Docker já instalado: $(docker --version)"
fi

# 2. Verifica Docker Compose plugin
if ! docker compose version &> /dev/null; then
  echo "[2/4] Instalando plugin Docker Compose..."
  sudo apt-get update -y && sudo apt-get install -y docker-compose-plugin
else
  echo "[2/4] Docker Compose OK: $(docker compose version)"
fi

# 3. Cria .env local se não existir
if [ ! -f .env ]; then
  echo "[3/4] Gerando arquivo .env com chaves seguras..."
  ENC_KEY=$(openssl rand -hex 24 2>/dev/null || echo "oz_digital_n8n_key_$(date +%s)")
  PG_PASS=$(openssl rand -hex 16 2>/dev/null || echo "oz_pg_pass_$(date +%s)")
  cat > .env <<EOF
POSTGRES_USER=ozadmin
POSTGRES_PASSWORD=${PG_PASS}
POSTGRES_DB=n8n_ozdigital
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678/
N8N_ENCRYPTION_KEY=${ENC_KEY}
EOF
else
  echo "[3/4] Arquivo .env já existente mantido."
fi

# 4. Sobe containers n8n + PostgreSQL em background
echo "[4/4] Subindo containers oz-postgres e oz-n8n..."
docker compose up -d

echo ""
echo "============================================================"
echo "  n8n rodando localmente na VPS com sucesso!"
echo "============================================================"
echo "  Painel n8n:    http://localhost:5678"
echo "  Webhook URL:   http://localhost:5678/webhook/oz-consultor"
echo ""
echo "  Próximos passos:"
echo "  1. Acesse http://localhost:5678 (ou via túnel SSH/Nginx)"
echo "  2. Crie seu usuário administrador no n8n"
echo "  3. Importe o fluxo: n8n/oz-consultor-workflow.json"
echo "  4. Ative o workflow (toggle Active = ON)"
echo "  5. Configure N8N_WEBHOOK_URL=http://localhost:5678/webhook/oz-consultor"
echo "============================================================"
