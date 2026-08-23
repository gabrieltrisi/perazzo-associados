# Deploy — Perazzo & Associados

**Hospedagem:** Vercel, conectada ao GitHub `gabrieltrisi/perazzo-associados`.
**Fluxo:** `git push` na branch **`main`** → a Vercel builda e publica em produção automaticamente.
**Banco:** Neon (PostgreSQL) — externo, mesma `DATABASE_URL` de dev e prod.

---

## Publicar (deploy)

```bash
git add -A
git commit -m "sua mensagem"
git push origin main      # Vercel detecta o push e faz o deploy de produção
```

Acompanhe o build em https://vercel.com → projeto **perazzo-associados** → Deployments.

---

## Variáveis de ambiente (Vercel → Settings → Environment Variables)

As de produção já existem (o site roda). Ao ligar o **envio do formulário**, adicione o bloco Zoho:

| Variável | Obrigatória | Observação |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://perazzoadvogados.com.br` |
| `DATABASE_URL` | ✅ | String **pooled** do Neon |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | ✅ | Login do painel (senha forte) |
| `JWT_SECRET` | ✅ | Aleatório forte (≥ 32 chars) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | `55` + DDD + número |
| `CONTACT_EMAIL_TO` / `CONTACT_EMAIL_FROM` | ✅ | Caixa contato@ |
| **`ZOHO_SMTP_HOST/PORT/USER/PASS`** | ✅ (p/ enviar) | **Adicionar.** Sem `ZOHO_SMTP_PASS` o form não envia. |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` | ⬜ | Anti-spam (recomendado) |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | ⬜ | Sem ela o mapa usa fallback pelo endereço |
| `RESEND_API_KEY` | ⬜ | Só se NÃO usar o Zoho |

> Depois de adicionar/alterar variável na Vercel, faça um **Redeploy** para valer.

Gerar segredos fortes:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"  # JWT_SECRET
node -e "console.log(require('crypto').randomBytes(12).toString('base64url'))"  # ADMIN_PASSWORD
```

---

## Notas

- **Build:** `npm run build` (= `prisma generate && next build`). Validado localmente — passa limpo.
- **Migrations não rodam no build.** O schema já está no Neon; só rode `npx prisma migrate deploy`
  se apontar para um banco novo.
- **Conteúdo do `/admin`** grava no Neon e **sobrepõe** os JSON de `content/` (JSON = padrão de fábrica / fallback).
- **DNS/E-mail:** o domínio já aponta pra Vercel; MX/SPF/DKIM do Zoho permanecem intocados.
- **Checklist pós-deploy:** Hero 3D abre · header sólido ao rolar · `/sobre` `/areas-de-atuacao` `/contato`
  redirecionam (308) · formulário chega em contato@ (exige `ZOHO_SMTP_PASS`) · `/admin` salva e reflete ·
  favicon (monograma P) na aba.
