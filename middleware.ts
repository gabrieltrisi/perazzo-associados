import { NextResponse, type NextRequest } from 'next/server';

/**
 * FRONTEIRA DE AUTENTICAÇÃO do Portal do Cliente.
 * Roda só em /portal/* (ver matcher). Sem cookie de sessão → manda pro /login.
 * Cookie nome fixo aqui pois o middleware roda no edge (não importa lib/auth,
 * que usa next/headers). Mantenha em sincronia com SESSION_COOKIE.
 */
const SESSION_COOKIE = 'perazzo_session';

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};