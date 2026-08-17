import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, assinarAdmin, credenciaisValidas } from '@/lib/admin-auth';
import { getAdmin } from '@/lib/admin-session';

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
    const email = String(formData.get('email') ?? '');
    const senha = String(formData.get('senha') ?? '');
    const dest = String(formData.get('destino') ?? '/admin');

    if (!credenciaisValidas(email, senha)) {
      redirect('/admin/login?erro=1');
    }
    const token = await assinarAdmin(email);
    const store = await cookies();
    store.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
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
              E-mail ou senha inválidos.
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