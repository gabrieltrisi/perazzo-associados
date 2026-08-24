import { SignJWT, jwtVerify } from 'jose';

/**
 * Auth do painel (equipe interna). JWT assinado (HS256) em cookie httpOnly.
 * Este arquivo é PURO (só jose) — roda no edge (middleware). NÃO importar
 * prisma/bcrypt/next-headers aqui. A verificação autoritativa (usuário ativo +
 * tokenVersion) fica em getAdmin() de lib/admin-session.ts (node + banco).
 */
export const ADMIN_COOKIE = 'perazzo_admin';

export type AdminToken = { uid: number; email: string; role: string; tv: number };

function secret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error('JWT_SECRET ausente ou muito curto — configure uma chave forte no ambiente.');
  }
  return new TextEncoder().encode(s);
}

// Comparação de tempo constante (sem node:crypto, roda no edge também).
export function igualTempoConstante(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function assinarAdmin(p: AdminToken): Promise<string> {
  return new SignJWT({ uid: p.uid, email: p.email, role: p.role, tv: p.tv })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret());
}

// Verifica só a ASSINATURA/validade do JWT (usado no middleware, edge).
// A checagem de usuário ativo/tokenVersion é feita depois, no banco.
export async function verificarToken(token?: string): Promise<AdminToken | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.uid !== 'number' || payload.role == null) return null;
    return {
      uid: payload.uid as number,
      email: String(payload.email ?? ''),
      role: String(payload.role),
      tv: Number(payload.tv ?? 0),
    };
  } catch {
    return null;
  }
}

// Credenciais de SEED (env) — usadas só para criar o 1º usuário owner quando
// a tabela ainda está vazia. Depois disso, o login é sempre contra o banco.
export function credenciaisEnvValidas(email: string, senha: string): boolean {
  const e = process.env.ADMIN_EMAIL ?? '';
  const s = process.env.ADMIN_PASSWORD ?? '';
  if (!e || !s) return false;
  const emailOk = igualTempoConstante(email.trim().toLowerCase(), e.toLowerCase());
  const senhaOk = igualTempoConstante(senha, s);
  return emailOk && senhaOk;
}
