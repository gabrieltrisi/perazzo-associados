import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Contador simples de visitas. Recebe o caminho da página e incrementa o
// agregado (path, dia). Ignora /admin e /api. Sem cookies/PII (LGPD-ok).
export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    let p = String(path ?? '').split('?')[0].split('#')[0];
    if (!p.startsWith('/') || p.startsWith('/admin') || p.startsWith('/api')) {
      return NextResponse.json({ ok: false });
    }
    if (p.length > 160) p = p.slice(0, 160);
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