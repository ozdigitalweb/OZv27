# Receita: publicar app React + Express + PostgreSQL na VPS (cPanel/Apache + Docker)

*Instruções para outro Claude conduzir o processo. Baseada na publicação do Rebeldia FM (04/11/2026).*

## Como você (Claude) deve conduzir

- O usuário tem SSH como root em uma VPS com cPanel/WHM, Apache (EasyApache), Docker e Portainer. Ele cola os comandos no terminal e devolve a saída na conversa.
- Passe **um passo por vez**, com comandos curtos, e espere a saída antes de seguir. Se ele colar o comando de volta sem saída, peça para rodar e devolver o resultado.
- Fale em linguagem simples. Se ele disser que não entendeu, reduza ao mínimo ("cole estas linhas, clique neste botão").
- Nunca peça que cole senhas na conversa. Mascare com `sed` quando precisar mostrar variáveis.
- Mexa só na conta cPanel do projeto. Outras contas do servidor são de outros projetos.
- Não apague volumes Docker sem confirmar o conteúdo.
- Não afirme o que o código faz sem ler. Quando houver dúvida, peça o trecho com `grep`/`sed`.
- Ao colar comandos, o terminal às vezes inclui `^[[200~` no início e o primeiro comando falha. Digitar ou colar em linha nova resolve. Confirme a pasta pelo prompt (`pwd`) antes de rodar `git` ou `docker build`.

## Variáveis que você vai precisar

| Nome | Exemplo | Onde se usa |
| --- | --- | --- |
| `DOMINIO` | `meusite.com.br` | proxy do Apache |
| `CONTA_CPANEL` | `meusite` | caminho do proxy e `ensure_vhost_includes` |
| `REPO` | `https://github.com/org/app` | clone na VPS |
| `PASTA` | `/var/www/app` | código na VPS |
| `IMAGEM` | `app-meusite` | imagem Docker local |
| `DB_USER` / `DB_NAME` | `usuario` / `meusite` | PostgreSQL |

## Arquitetura final

- O app (Express serve a API e o build do React) roda em um container Docker, porta 3000, publicada só em `127.0.0.1:3000`.
- O PostgreSQL roda em outro container, sem porta pública, na mesma rede da stack.
- O Apache do cPanel recebe 80/443, faz o proxy reverso para `127.0.0.1:3000` e o AutoSSL emite o certificado.
- O Portainer gerencia a stack. O código vem do GitHub (branch `main`) e a imagem é construída localmente.
- Não use Nginx Proxy Manager: o Apache já ocupa as portas 80 e 443.

## Passo 1: ler o projeto antes de tudo

No clone do código, descubra como o app usa banco, variáveis e rotas:

```bash
cd PASTA
cat package.json | grep -A12 '"scripts"'
cat src/db/index.ts
grep -rn -o "process\.env\.[A-Z_]*" server.ts src | sort -u
grep -n -E "app\.(get|post|put|delete)\(" server.ts | head -80
```

Anote:

- **Como o app conecta ao banco.** Alguns apps leem `DATABASE_URL`, outros leem variáveis separadas (`SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`). Se o código lê variáveis separadas e elas não existirem, o `pg` cai em `localhost` e dá `ECONNREFUSED`. Defina **as duas formas** na stack.
- **Se o app só serve o build quando `NODE_ENV=production`.** Sem isso ele liga o Vite de desenvolvimento e responde `403`.
- **As rotas reais.** Não confie no README: rotas inexistentes devolvem o `index.html` com `200`, o que engana testes.

## Passo 2: código na VPS e imagem Docker

```bash
git clone REPO PASTA
cd PASTA
```

Se o repositório não tiver `Dockerfile`, crie um em `PASTA`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Não defina `NODE_ENV=production` dentro do `Dockerfile` antes do `npm install` (as dependências de build deixariam de ser instaladas). Defina na stack.

Se o front usa variáveis `VITE_*`, elas entram no **build**, não só na execução. Passe-as com `ARG`/`ENV` antes do `npm run build`.

Construa:

```bash
docker build -t IMAGEM PASTA
```

## Passo 3: stack no Portainer

Em **Stacks → Add stack → Web editor**, cole (troque os valores):

```yaml
version: '3.8'
services:

  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: DB_USER
      POSTGRES_PASSWORD: SENHA_DO_BANCO
      POSTGRES_DB: DB_NAME
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    image: IMAGEM
    restart: always
    ports:
      - "127.0.0.1:3000:3000"
    depends_on:
      - db
    environment:
      - PORT=3000
      - NODE_ENV=production
      - DATABASE_URL=postgres://DB_USER:SENHA_DO_BANCO@db:5432/DB_NAME
      - SQL_HOST=db
      - SQL_USER=DB_USER
      - SQL_PASSWORD=SENHA_DO_BANCO
      - SQL_DB_NAME=DB_NAME
      - ADMIN_USER=USUARIO_ADMIN
      - ADMIN_PASSWORD=SENHA_ADMIN_FORTE

volumes:
  postgres_data:
```

Pontos importantes:

- A porta `127.0.0.1:3000:3000` impede acesso direto pelo IP público. Use `"3000:3000"` só se quiser teste externo temporário.
- O host do banco é o nome do serviço (`db`), nunca `localhost`.
- Senha com `@`, `:`, `/` ou `#` precisa ser codificada no `DATABASE_URL`. Prefira senhas sem esses caracteres.
- Gere a senha do admin com `openssl rand -base64 18`. Se o código tiver usuário/senha padrão escritos nele e o repositório for público, esse padrão está comprometido: sempre defina valores próprios.
- Se o Portainer não recriar o container ao atualizar, rode `docker rm -f NOME_DO_CONTAINER` e atualize a stack de novo. O banco fica no volume.

Confirme:

```bash
docker ps --format '{{.Names}}  {{.Ports}}'
docker logs --tail 40 NOME_DO_CONTAINER_APP
curl -I http://127.0.0.1:3000
```

Esperado: containers de pé, porta `127.0.0.1:3000->3000/tcp`, resposta `200` com `X-Powered-By: Express`.

## Passo 4: criar as tabelas

Verifique se o banco tem tabelas:

```bash
docker exec NOME_DO_CONTAINER_DB psql -U DB_USER -d DB_NAME -c '\dt'
```

Se responder "Did not find any relations", o app não cria o esquema sozinho. Com Drizzle:

```bash
docker exec NOME_DO_CONTAINER_APP sh -c 'npx drizzle-kit push --dialect=postgresql --schema=./src/db/schema.ts --url="$DATABASE_URL" --force' 2>&1 | tail -40
docker exec NOME_DO_CONTAINER_DB psql -U DB_USER -d DB_NAME -c '\dt'
```

Se o app popula dados iniciais na inicialização, reinicie e confira:

```bash
docker restart NOME_DO_CONTAINER_APP
sleep 8
docker logs --tail 30 NOME_DO_CONTAINER_APP
```

Esperado: tabelas listadas, nenhum `ECONNREFUSED` e mensagens de carga inicial bem-sucedida.

## Passo 5: proxy reverso no Apache do cPanel

Crie dois arquivos (HTTP e HTTPS) e aplique:

```bash
for T in std ssl; do
  D=/etc/apache2/conf.d/userdata/$T/2_4/CONTA_CPANEL/DOMINIO
  mkdir -p $D
  cat > $D/proxy.conf <<'EOF'
ProxyPreserveHost On
ProxyPass /.well-known !
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
EOF
done
/scripts/ensure_vhost_includes --user=CONTA_CPANEL
/scripts/restartsrv_httpd
sleep 3
curl -I https://DOMINIO
```

A linha `ProxyPass /.well-known !` mantém a validação do AutoSSL funcionando. Esperado: `HTTP/1.1 200 OK` com `X-Powered-By: Express`.

Avisos de `DocumentRoot ... does not exist` de outras contas são normais e não devem ser corrigidos. A mensagem "Creating missing document root" para a conta do projeto também é normal.

Se o certificado falhar, no WHM abra *Manage AutoSSL* e rode o AutoSSL para a conta do projeto.

## Passo 6: conferir recursos externos

Se o app carrega áudio, vídeo ou APIs de outro servidor direto no navegador, teste com o `Origin` do seu domínio e com User-Agent de navegador:

```bash
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36"
curl -s -o /dev/null -D - -A "$UA" -H "Origin: https://DOMINIO" --max-time 5 "URL_DO_RECURSO" | head -10
```

O erro de CORS no Console (F12) costuma vir de **URL errada**, não de falta de proxy. Em streams Shoutcast, a raiz `/` redireciona para uma página de status sem `Access-Control-Allow-Origin`, enquanto `/;` serve o áudio com o cabeçalho. Se a URL do stream ficar guardada no banco (tabela de configurações), corrija lá com `INSERT ... ON CONFLICT (key) DO UPDATE` e teste em janela anônima com Ctrl+F5.

## Passo 7: segurança antes de divulgar

Teste as rotas **reais** (listadas no Passo 1) procurando dados sensíveis:

```bash
for r in ROTA1 ROTA2 ROTA3; do echo -n "$r: "; curl -s http://127.0.0.1:3000/api/$r | grep -c -i -E '"password"|senha'; done
curl -s http://127.0.0.1:3000/api/ROTA_DE_CONTAS | head -c 400; echo
```

Verifique também:

- Rotas de contas não devolvem `password` nem hash, nem e-mails que não precisem ser públicos.
- Senhas de usuários ficam com hash (scrypt ou bcrypt) e a comparação é em tempo constante.
- As rotas de escrita e de administração exigem token verdadeiro (JWT assinado, com validade). Um token como `'texto_fixo_' + Date.now()` que ninguém valida não protege nada.
- Nenhum usuário, senha ou segredo está escrito no código. Tudo vem de variáveis de ambiente definidas na stack.
- O acesso direto pelo IP é bloqueado:

```bash
curl -s -o /dev/null -m 5 -w "%{http_code}\n" http://IP_DA_VPS:3000/
```

Esperado: `000`. Se algum desses itens falhar, corrija no código (pedido ao desenvolvedor ou ao AI Studio) antes de divulgar o site.

## Passo 8: backup

```bash
docker exec NOME_DO_CONTAINER_DB pg_dump -U DB_USER DB_NAME > /root/backup-$(date +%F-%H%M).sql
ls -la /root/backup-*.sql
```

Faça um backup antes de cada atualização.

## Passo 9: atualizações futuras

Fluxo: AI Studio (ou editor) → GitHub → `main` → VPS.

```bash
cd PASTA
git fetch origin main
git log --oneline HEAD..origin/main
git diff --stat HEAD origin/main | tail -10
git show origin/main:server.ts | grep -o "process\.env\.[A-Z_]*" | sort -u
```

O último comando mostra se surgiu variável de ambiente nova. Se sim, acrescente-a na stack **antes** de recriar o container. Depois:

```bash
git pull origin main
docker build -t IMAGEM .
```

No Portainer: **Stacks → (stack) → Update the stack**, com *Re-deploy* marcado e *Re-pull image* desmarcado. Se o container não for recriado, use `docker rm -f NOME_DO_CONTAINER_APP` e atualize de novo. Confira:

```bash
sleep 10
docker logs --tail 20 NOME_DO_CONTAINER_APP
curl -s -o /dev/null -w "%{http_code}\n" https://DOMINIO
```

## Checklist final

- [ ] Containers de pé, app em `127.0.0.1:3000`, banco sem porta pública.
- [ ] `NODE_ENV=production`, variáveis de banco (`DATABASE_URL` e `SQL_*`) e admin definidas na stack.
- [ ] Tabelas criadas e dados iniciais carregados.
- [ ] `https://DOMINIO` responde `200` com certificado válido.
- [ ] Recursos externos (áudio, vídeo, APIs) funcionam no navegador, sem erro de CORS no Console.
- [ ] Nenhuma rota devolve senha ou hash; rotas de escrita protegidas; IP direto bloqueado.
- [ ] Login do admin com credenciais próprias; padrão do código recusado.
- [ ] Backup feito e fluxo de atualização testado.
- [ ] Limpeza: portas antigas fechadas no firewall e destino dos volumes antigos decidido.
