import { SignJWT, jwtVerify } from 'jose';

/**
 * Auth REAL do dono (admin). JWT assinado (HS256) em cookie httpOnly.
 * Este arquivo é PURO (só jose) — pode ser importado no middleware (edge).
 * Não importe next/headers aqui. Para ler a sessão em Server Components,
 * use getAdmin() de lib/admin-session.ts.
 */
export const ADMIN_COOKIE = 'perazzo_admin';

function secret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'dev-inseguro-troque-em-producao');
}

export async function assinarAdmin(email: string): Promise<string> {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret());
}

export async function verificarAdmin(token?: string): Promise<{ email: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role !== 'admin') return null;
    return { email: String(payload.email ?? 'admin') };
  } catch {
    return null;
  }
}

// Confere as credenciais contra as variáveis de ambiente (dono único).
export function credenciaisValidas(email: string, senha: string): boolean {
  const e = process.env.ADMIN_EMAIL ?? '';
  const s = process.env.ADMIN_PASSWORD ?? '';
  return Boolean(e && s) && email.trim().toLowerCase() === e.toLowerCase() && senha === s;
}