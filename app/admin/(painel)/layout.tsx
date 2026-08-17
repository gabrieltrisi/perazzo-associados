import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAdmin } from '@/lib/admin-session';
import { ADMIN_COOKIE } from '@/lib/admin-auth';

const nav = [
  { href: '/admin', label: 'Painel' },
  { href: '/admin/home', label: 'Home' },
  { href: '/admin/contato', label: 'Contato' },
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
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <span className="font-serif text-gold">Painel</span>
            <nav className="flex items-center gap-4 text-sm">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="text-white/80 transition-colors hover:text-gold">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-white/60 transition-colors hover:text-gold">
              Ver site ↗
            </Link>
            <form action={sair}>
              <button type="submit" className="text-white/80 transition-colors hover:text-gold">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}