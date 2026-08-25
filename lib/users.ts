import 'server-only';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

export type SessionUser = { id: number; email: string; name: string; role: string; tokenVersion: number };

const norm = (email: string) => email.trim().toLowerCase();

export function hashSenha(senha: string): string {
  return bcrypt.hashSync(senha, 10);
}

export async function contarUsuarios(): Promise<number> {
  return prisma.user.count();
}

// Login: e-mail + senha contra o banco. Retorna o usuário se ativo e a senha bater.
export async function verificarLogin(email: string, senha: string): Promise<SessionUser | null> {
  const u = await prisma.user.findUnique({ where: { email: norm(email) } });
  if (!u || !u.active) return null;
  if (!bcrypt.compareSync(senha, u.passwordHash)) return null;
  return { id: u.id, email: u.email, name: u.name, role: u.role, tokenVersion: u.tokenVersion };
}

export async function criarUsuario(dados: {
  email: string;
  name: string;
  senha: string;
  role: 'owner' | 'editor';
}): Promise<SessionUser> {
  const u = await prisma.user.create({
    data: {
      email: norm(dados.email),
      name: dados.name.slice(0, 120),
      passwordHash: hashSenha(dados.senha),
      role: dados.role === 'owner' ? 'owner' : 'editor',
    },
  });
  return { id: u.id, email: u.email, name: u.name, role: u.role, tokenVersion: u.tokenVersion };
}

export async function listarUsuarios() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, name: true, role: true, active: true, createdAt: true },
  });
}

// Ativa/desativa (desativar revoga o acesso imediatamente via getAdmin).
export async function setUsuarioAtivo(id: number, active: boolean) {
  await prisma.user.update({ where: { id }, data: { active } });
}

// Redefine senha e incrementa tokenVersion → derruba todas as sessões abertas.
export async function redefinirSenha(id: number, senha: string) {
  await prisma.user.update({
    where: { id },
    data: { passwordHash: hashSenha(senha), tokenVersion: { increment: 1 } },
  });
}
