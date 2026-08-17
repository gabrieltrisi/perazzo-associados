import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSession, SESSION_COOKIE } from '@/lib/auth';

// Casca da área protegida: valida a sessão no servidor (além do middleware)
// e oferece o logout. Defense-in-depth.
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login?redirect=/portal');

  async function sair() {
    'use server';
    const store = await cookies();
    store.delete(SESSION_COOKIE);
    redirect('/login');
  }

  return (
    <div className="min-h-[70vh] bg-offwhite">
      <div className="bg-navy text-white">
        <div className="container-px flex h-14 items-center justify-between">
          <span className="text-sm">
            Área do Cliente · <span className="text-gold">{session.email}</span>
          </span>
          <form action={sair}>
            <button type="submit" className="text-sm text-white/80 transition-colors hover:text-gold">
              Sair
            </button>
          </form>
        </div>
      </div>
      <div className="container-px py-10">{children}</div>
    </div>
  );
}