import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAdmin } from '@/lib/admin-session';
import { ADMIN_COOKIE } from '@/lib/admin-auth';

const nav = [
  { href: '/admin/home', label: 'Home' },
  { href: '/admin/contato', label: 'Contato' },
  { href: '/admin/faq', label: 'FAQ' },
  { href: '/admin/areas', label: 'Áreas' },
  { href: '/admin/sobre', label: 'Sobre' },
  { href: '/admin/blog', label: 'Blog' },
];

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login');

  async function sair() {
    'use server';
    const store = await cookies();
    store.delete(ADMIN_COOKIE);
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <header className="border-b border-navy/10 bg-navy text-white">
        <div className="mx-auto max-w-5xl px-5">
          {/* Linha 1: marca + Sair (SEMPRE visíveis, inclusive no mobile) */}
          <div className="flex h-14 items-center justify-between gap-4">
            <Link href="/admin" className="font-serif text-gold">
              Painel
            </Link>
            <div className="flex shrink-0 items-center gap-4 text-sm">
              <Link href="/" className="hidden text-white/60 transition-colors hover:text-gold sm:inline">
                Ver site ↗
              </Link>
              <form action={sair}>
                <button type="submit" className="text-white/80 transition-colors hover:text-gold">
                  Sair
                </button>
              </form>
            </div>
          </div>
          {/* Linha 2: navegação — rola na horizontal no celular */}
          <nav className="-mb-px flex items-center gap-5 overflow-x-auto whitespace-nowrap pb-2 text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="shrink-0 text-white/80 transition-colors hover:text-gold"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}