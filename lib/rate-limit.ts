import { prisma } from './db';

// Extrai o IP do cliente dos headers (Vercel/proxy põe em x-forwarded-for).
export function ipDeHeaders(h: Headers): string {
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || 'sem-ip';
}

/**
 * Rate limit de janela fixa, contador no Postgres (funciona em serverless).
 * `limite` acessos por `janelaSegundos`, por `key` (ex.: "login:1.2.3.4").
 * Fail-open: se o banco falhar, NÃO bloqueia (não derruba o site).
 */
export async function rateLimit(
  key: string,
  limite: number,
  janelaSegundos: number,
): Promise<{ ok: boolean; restante: number; resetEmSegundos: number }> {
  const agora = new Date();
  try {
    const reg = await prisma.rateLimit.findUnique({ where: { key } });

    // Janela nova (inexistente ou expirada) → reinicia.
    if (!reg || reg.expiresAt < agora) {
      const expiresAt = new Date(agora.getTime() + janelaSegundos * 1000);
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, expiresAt },
        update: { count: 1, expiresAt },
      });
      return { ok: true, restante: limite - 1, resetEmSegundos: janelaSegundos };
    }

    const resetEm = Math.max(0, Math.ceil((reg.expiresAt.getTime() - agora.getTime()) / 1000));

    if (reg.count >= limite) {
      return { ok: false, restante: 0, resetEmSegundos: resetEm };
    }

    await prisma.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
    return { ok: true, restante: limite - reg.count - 1, resetEmSegundos: resetEm };
  } catch {
    return { ok: true, restante: limite, resetEmSegundos: 0 };
  }
}