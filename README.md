# Perazzo & Associados — Site Institucional + Painel

Site institucional **full-stack** para um escritório de advocacia (Salvador/BA), com **animação 3D no Hero**, **painel administrativo multiusuário** (mini-CMS + CRM de leads) e **formulário de contato transacional**. Projeto real, em produção.

🔗 **Ao vivo:** https://perazzoadvogados.com.br

---

## ✨ Destaques

- **Hero 3D interativo (WebGL)** — uma balança da justiça em ouro, modelada em código com **React Three Fiber**: equilibra-se com o mouse/scroll, tem **martelo que bate ao clicar** (com som, onda de impacto e tremor amortecido), reflexos de ambiente, luz que segue o cursor e **pausa automática** quando sai da tela (economia de GPU).
- **Página única fiel a um design de referência** — seções com cortes diagonais, tipografia editorial (Bodoni + Inter), carrossel *coverflow* 3D, quiz de diagnóstico interativo, scroll-spy e microinterações.
- **Painel administrativo (headless CMS)** — edição de todo o conteúdo do site sem tocar no código, com **autenticação multiusuário**, papéis (dono/editor), **revogação de sessão** e **trilha de auditoria**.
- **Mini-CRM de leads** — cada envio do formulário é persistido no banco (não se perde se o e-mail falhar), com status *novo/atendido* e resposta rápida por e-mail/WhatsApp.
- **Formulário de contato transacional** — envio via **Resend** com domínio verificado (SPF/DKIM), rate limiting, honeypot e reCAPTCHA.
- **SEO técnico** — JSON-LD (`LegalService` + `Attorney` + `FAQPage`), sitemap, robots, OpenGraph dinâmico e metadata por rota.

## 🧱 Stack

| Camada | Tecnologias |
|---|---|
| **Front-end** | Next.js 15 (App Router, RSC), React 19, TypeScript, Tailwind CSS, Framer Motion |
| **3D** | Three.js, @react-three/fiber, @react-three/drei |
| **Back-end** | Route Handlers + Server Actions, Prisma ORM, PostgreSQL (Neon) |
| **Auth** | JWT (jose) em middleware edge + verificação no banco, bcrypt, RBAC |
| **E-mail** | Resend (domínio verificado) + fallback SMTP |
| **Infra** | Vercel (CI/CD via GitHub), edge middleware, ISR/SSG |

## 🏗️ Decisões de arquitetura

- **Camada de conteúdo com fallback** — cada seção lê do banco (editável no painel) e, se vazio, cai no **JSON versionado** do repositório. O site nunca quebra por falta de dado; o admin sobrepõe quando quer.
- **Auth em profundidade** — o middleware (edge) valida a assinatura do JWT; os Server Components/Actions revalidam no banco (**usuário ativo + `tokenVersion`**), permitindo revogar sessões. Todas as ações sensíveis passam por `exigirAdmin`/`exigirOwner`.
- **Segurança** — CSP + cabeçalhos de segurança, **rate limiting durável** (contador no Postgres, funciona em serverless), *error boundaries* (conteúdo malformado não derruba a página), limites anti-DoS nos formulários, JSON-LD escapado (anti-XSS) e conteúdo de blog em **Markdown puro** (sem execução de código).
- **Performance & acessibilidade** — imagens otimizadas, 3D com *poster* de fallback no mobile, respeito a `prefers-reduced-motion`, foco de teclado visível e pausa do render fora da viewport.

## 🖥️ Painel `/admin`

- **Leads** (CRM) · **Home / Áreas / FAQ / Contato** (CMS) · **Blog** (rascunho → publicar) · **Usuários** (RBAC, só dono) · **Auditoria**.

---

## 🚀 Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha os valores (DB, JWT, Resend, WhatsApp…)
npx prisma migrate deploy    # aplica o schema no banco
npm run dev                  # http://localhost:3000
```

Variáveis de ambiente documentadas em [`.env.example`](.env.example) e o guia de deploy em [`DEPLOY.md`](DEPLOY.md).

## ✏️ Editando conteúdo (sem código)

Todo texto, contato e redes vivem em **`content/*.json`** (fallback) e são editáveis pelo painel `/admin` (que grava no banco e sobrepõe o JSON).

---

<sub>Projeto desenvolvido por **Gabriel Trisi**. Stack full-stack (Next.js · TypeScript · Three.js · Prisma · PostgreSQL).</sub>
