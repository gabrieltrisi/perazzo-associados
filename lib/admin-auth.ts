import { SignJWT, jwtVerify } from 'jose';

/**
 * Auth REAL do dono (admin). JWT assinado (HS256) em cookie httpOnly.
 * Este arquivo é PURO (só jose) — pode ser importado no middleware (edge).
 * Não importe next/headers aqui. Para ler a sessão em Server Components,
 * use getAdmin() de lib/admin-session.ts.
 */
export const ADMIN_COOKIE = 'perazzo_admin';

// Fail-closed: sem JWT_SECRET (ou fraco) NÃO há fallback conhecido — assinar
// falha e verificar nega. Evita que alguém forje token com um segredo público.
function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error('JWT_SECRET ausente ou muito curto — configure uma chave forte no ambiente.');
  }
  return new TextEncoder().encode(s);
}

// Comparação de tempo constante (sem node:crypto, roda no edge também).
function igualTempoConstante(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
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
  if (!e || !s) return false; // sem credenciais configuradas → ninguém entra
  const emailOk = igualTempoConstante(email.trim().toLowerCase(), e.toLowerCase());
  const senhaOk = igualTempoConstante(senha, s);
  return emailOk && senhaOk;
}