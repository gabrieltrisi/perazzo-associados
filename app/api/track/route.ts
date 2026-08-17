import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Só rotas reais do site são contáveis — impede que um atacante crie linhas
// infinitas com paths arbitrários (bloat/DoS no banco).
const ROTAS_FIXAS = new Set([
  '/',
  '/sobre',
  '/areas-de-atuacao',
  '/blog',
  '/contato',
  '/politica-de-privacidade',
  '/termos-de-uso',
]);

function rotaValida(p: string): boolean {
  return ROTAS_FIXAS.has(p) || /^\/blog\/[a-z0-9-]{1,80}$/.test(p);
}

// Contador simples de visitas. Recebe o caminho da página e incrementa o
// agregado (path, dia). Sem cookies/PII (LGPD-ok).
export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    const p = String(path ?? '').split('?')[0].split('#')[0];
    if (!rotaValida(p)) {
      return NextResponse.json({ ok: false });
    }
    const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)

    await prisma.pageView.upsert({
      where: { path_day: { path: p, day } },
      create: { path: p, day, count: 1 },
      update: { count: { increment: 1 } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}