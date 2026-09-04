import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, DEMO_PASSWORD, getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Entrar',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; erro?: string }>;
}) {
  const sp = await searchParams;
  if (await getSession()) redirect('/portal');

  const destino = sp.redirect?.startsWith('/portal') ? sp.redirect : '/portal';

  async function entrar(formData: FormData) {
    'use server';
    const email = String(formData.get('email') ?? '').trim();
    const senha = String(formData.get('senha') ?? '');
    const dest = String(formData.get('destino') ?? '/portal');

    // MOCK: aceita qualquer e-mail com a senha de demonstração.
    if (!email || senha !== DEMO_PASSWORD) {
      const q = dest !== '/portal' ? `&redirect=${encodeURIComponent(dest)}` : '';
      redirect(`/login?erro=1${q}`);
    }

    const store = await cookies();
    store.set(SESSION_COOKIE, encodeURIComponent(email), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    redirect(dest.startsWith('/portal') ? dest : '/portal');
  }

  return (
    <section className="flex min-h-[80vh] items-center bg-navy">
      <div className="container-px w-full max-w-md">
        <p className="kicker mb-3 inline-block">Área do Cliente</p>
        <h1 className="text-[2rem] font-bold text-white">Entrar</h1>
        <p className="mt-2 text-sm text-white/70">
          Acesse o acompanhamento do seu caso e seus documentos.
        </p>

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
          <p className="rounded bg-offwhite px-3 py-2 text-center text-xs text-muted">
            🔒 Demonstração: use qualquer e-mail e a senha <strong>demo</strong>.
          </p>
        </form>
      </div>
    </section>
  );
}