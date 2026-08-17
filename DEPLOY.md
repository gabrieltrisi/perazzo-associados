# Deploy — VPS (Hostinger / Ubuntu)

Guia para publicar o site (Next.js + Prisma) num VPS. O banco é o **Neon
(PostgreSQL)** — já configurado, separado do servidor.

> Specs recomendadas: **KVM 2 (2 vCPU, 8 GB)**, Ubuntu 22.04/24.04 limpo.
> Com KVM 1 (4 GB), adicione swap (passo 4).

---

## 1. Domínio → VPS
No painel do domínio (ex.: Registro.br), aponte para o IP do VPS:
- Registro **A** `@` → `IP_DO_VPS`
- Registro **A** `www` → `IP_DO_VPS`

(A propagação leva de minutos a algumas horas.)

## 2. Acessar o servidor
```bash
ssh root@IP_DO_VPS
```

## 3. Pacotes base
```bash
apt update && apt upgrade -y
# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx
npm install -g pm2
```

## 4. (Só KVM 1 / 4 GB) — swap para o build não faltar memória
```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 5. Baixar o projeto
```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/gabrieltrisi/perazzo-associados.git perazzo
cd perazzo
```

## 6. Variáveis de ambiente
Crie o arquivo `.env` (NÃO é versionado):
```bash
nano .env
```
Conteúdo (troque os valores):
```
DATABASE_URL="postgresql://...neon.../neondb?sslmode=require&channel_binding=require"
JWT_SECRET="uma-chave-aleatoria-forte"
ADMIN_EMAIL="seu-email"
ADMIN_PASSWORD="uma-senha-forte"
NEXT_PUBLIC_SITE_URL="https://perazzoadvogados.com.br"
# Opcionais: RESEND_API_KEY, CONTACT_EMAIL_TO, NEXT_PUBLIC_WHATSAPP_NUMBER, etc.
```
Gerar um JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

## 7. Instalar, migrar e buildar
```bash
npm ci
npx prisma generate
npx prisma migrate deploy   # cria/atualiza as tabelas no Neon (idempotente)
npm run build
```

## 8. Subir com PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup    # rode o comando que ele imprimir (liga o PM2 no boot)
```
O app agora roda em `127.0.0.1:3000`.

## 9. Nginx (proxy reverso)
```bash
cp deploy/nginx.conf.example /etc/nginx/sites-available/perazzo
# ajuste o server_name se o domínio for outro:
nano /etc/nginx/sites-available/perazzo
ln -s /etc/nginx/sites-available/perazzo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 10. HTTPS (SSL grátis, Let's Encrypt)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d perazzoadvogados.com.br -d www.perazzoadvogados.com.br
```
Renova sozinho. O site já responde em **https://**.

## 11. Firewall (recomendado)
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## Atualizar o site depois (nova versão)
```bash
cd /var/www/perazzo && bash deploy/update.sh
```

## Segurança (antes do go-live)
- [ ] **Resetar a senha do Neon** (apareceu em conversa) e usar a nova no `.env`
- [ ] `ADMIN_PASSWORD` forte (nunca `admin123`)
- [ ] `JWT_SECRET` só no `.env` do servidor (nunca no código)
- [ ] Firewall ligado (passo 11)
- [ ] Ligar reCAPTCHA no formulário (chaves no `.env`) — opcional

## Comandos úteis
```bash
pm2 logs perazzo     # ver logs
pm2 restart perazzo  # reiniciar
pm2 monit            # monitorar
```