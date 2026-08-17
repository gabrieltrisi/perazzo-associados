import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verificarAdmin } from './admin-auth';

// Lê a sessão do admin em Server Components/Actions (usa next/headers).
// NÃO importar no middleware — lá use verificarAdmin diretamente.
export async function getAdmin(): Promise<{ email: string } | null> {
  const store = await cookies();
  return verificarAdmin(store.get(ADMIN_COOKIE)?.value);
}