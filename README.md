# Perazzo & Associados — Site Institucional

Site institucional do escritório **Perazzo & Associados Advogados** (Salvador/BA).
Stack: **Next.js (App Router) · TypeScript · Tailwind CSS**.

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # e preencha os valores (veja abaixo)
npm run dev                  # http://localhost:3000
```

## Como editar o conteúdo (sem mexer em código)

Todos os textos, contato e redes ficam em **`content/`** — nunca dentro dos componentes:

| Arquivo | O que edita |
|---|---|
| `content/site-config.json` | Telefone, e-mail, endereço, redes sociais, OAB |
| `content/home.json` | Textos da Home |
| `content/sobre.json` | História, missão, visão, valores |
| `content/areas-de-atuacao.json` | Áreas de atuação |
| `content/blog/*.mdx` | Artigos do blog (um arquivo por post) |

A **logo** fica em `public/logo.png` (ver `public/COLOQUE-AS-LOGOS-AQUI.txt`).

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` — envio do formulário
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` — anti-spam (opcional em dev)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — botão de WhatsApp
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` — mapa na página de Contato
- `NEXT_PUBLIC_SITE_URL` — URL pública (sitemap/robots/OpenGraph)

## Deploy (Vercel recomendado)

1. Suba o repositório no GitHub.
2. Importe em [vercel.com](https://vercel.com) → framework detectado automaticamente (Next.js).
3. Configure as variáveis de ambiente acima em **Project → Settings → Environment Variables**.
4. Deploy. O SSL é automático.

---

> Conformidade: este site segue LGPD (Política de Privacidade + Termos + consentimento no
> formulário) e o Provimento 205/2021 da OAB (tom sóbrio, sem promessa de resultado).