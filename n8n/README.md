# n8n Local na VPS — Oz Digital (Consultor Virtual Funil)

Este diretório contém toda a infraestrutura pronta para rodar o **n8n** + **PostgreSQL** localmente na sua VPS e conectá-lo diretamente ao **Consultor Virtual** deste site.

## Arquivos incluídos

- `docker-compose.yml` — Stack completa com `n8n` (porta local `5678`) e `postgres:16-alpine`.
- `install-vps.sh` — Script automatizado para instalar o Docker (se necessário), gerar chaves seguras e subir o n8n na VPS.
- `oz-consultor-workflow.json` — Fluxo pronto para importar no n8n (`Webhook Consultor Site` → `Processar Funil Consultor` → `Responder ao Site`).

## Como subir na sua VPS

1. Na VPS, dentro da pasta do projeto, execute:
   ```bash
   chmod +x n8n/install-vps.sh
   bash n8n/install-vps.sh
   ```
2. Acesse o painel do n8n em `http://localhost:5678` (ou configure seu proxy reverso Nginx/Traefik no subdomínio `https://n8n.seudominio.com.br`).
3. No menu do n8n, clique em **Add Workflow → Import from File** e selecione `n8n/oz-consultor-workflow.json`.
4. Ative o workflow (`Active = ON`).
5. No painel **OZGESTOR** (`/admin` → **Consultor & n8n (VPS)**) ou no `.env` do servidor Node/Express, defina:
   ```env
   N8N_WEBHOOK_URL="http://localhost:5678/webhook/oz-consultor"
   ```
6. Clique em **Testar Webhook n8n** no painel `/admin` para validar a conexão em tempo real.
