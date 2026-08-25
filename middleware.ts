import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verificarToken } from '@/lib/admin-auth';

/**
 * Fronteiras de autenticação:
 * - /admin/*  → área do DONO (auth real, JWT assinado). /admin/login é livre.
 * - /portal/* → área do CLIENTE (scaffold mock por cookie).
 * jose funciona no edge, então a verificação do admin roda aqui.
 */
const CLIENT_COOKIE = 'perazzo_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---- Admin (dono) ----
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    const tok = await verificarToken(request.cookies.get(ADMIN_COOKIE)?.value);
    if (!tok) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ---- Portal do cliente (mock) ----
  if (!request.cookies.get(CLIENT_COOKIE)?.value) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
};