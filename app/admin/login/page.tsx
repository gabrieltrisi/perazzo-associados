import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { ADMIN_COOKIE, assinarAdmin, credenciaisEnvValidas } from '@/lib/admin-auth';
import { getAdmin } from '@/lib/admin-session';
import { verificarLogin, contarUsuarios, criarUsuario } from '@/lib/users';
import { registrarAudit } from '@/lib/audit';
import { rateLimit, ipDeHeaders } from '@/lib/rate-limit';

export const metadata: Metadata = {
  title: 'Admin — Entrar',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; erro?: string }>;
}) {
  const sp = await searchParams;
  if (await getAdmin()) redirect('/admin');
  const destino = sp.redirect?.startsWith('/admin') && sp.redirect !== '/admin/login' ? sp.redirect : '/admin';

  async function entrar(formData: FormData) {
    'use server';
    // Rate limit por IP: trava brute-force (8 tentativas / 10 min).
    const ip = ipDeHeaders(await headers());
    if (!(await rateLimit(`login:${ip}`, 8, 600)).ok) {
      redirect('/admin/login?erro=rate');
    }

    const email = String(formData.get('email') ?? '');
    const senha = String(formData.get('senha') ?? '');
    const dest = String(formData.get('destino') ?? '/admin');

    let user = await verificarLogin(email, senha);
    // Seed do 1º owner: se a tabela está vazia e as credenciais batem com as
    // variáveis de ambiente (ADMIN_EMAIL/ADMIN_PASSWORD), cria o dono inicial.
    if (!user && (await contarUsuarios()) === 0 && credenciaisEnvValidas(email, senha)) {
      user = await criarUsuario({ email, name: 'Administrador', senha, role: 'owner' });
      await registrarAudit(user.email, 'seed:owner', 'Primeiro usuário criado a partir do ambiente', ip);
    }
    if (!user) {
      redirect('/admin/login?erro=1');
    }
    const token = await assinarAdmin({ uid: user.id, email: user.email, role: user.role, tv: user.tokenVersion });
    const store = await cookies();
    store.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    await registrarAudit(user.email, 'login', '', ip);
    redirect(dest.startsWith('/admin') ? dest : '/admin');
  }

  return (
    <section className="flex min-h-screen items-center bg-navy-deep">
      <div className="container-px w-full max-w-md">
        <p className="kicker mb-3 inline-block">Painel do site</p>
        <h1 className="text-[2rem] font-bold text-white">Entrar como administrador</h1>
        <p className="mt-2 text-sm text-white/60">Acesso restrito ao responsável pelo site.</p>

        <form action={entrar} className="mt-8 space-y-4 rounded-card bg-white p-6 shadow-soft-lg sm:p-8">
          <input type="hidden" name="destino" value={destino} />
          {sp.erro && (
            <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {sp.erro === 'rate'
                ? 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
                : 'E-mail ou senha inválidos.'}
            </p>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-navy-light/30 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>
          <div>
            <label htmlFor="senha" className="mb-1 block text-sm font-medium text-ink">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-navy-light/30 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-gold px-6 py-3 font-sans text-sm font-semibold tracking-wide text-navy transition-colors hover:bg-gold-deep"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}