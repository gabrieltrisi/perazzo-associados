import { NextResponse, type NextRequest } from 'next/server';

/**
 * FRONTEIRA DE AUTENTICAÇÃO — pronta para o futuro Portal do Cliente.
 *
 * Hoje NÃO há login: a rota /portal é pública (placeholder "em breve").
 * Quando o portal for construído, é só:
 *   1. Adicionar um provedor de sessão (ex.: NextAuth/Auth.js).
 *   2. Descomentar o bloco abaixo (checa o cookie de sessão e redireciona
 *      para /login quando ausente).
 * O restante do site institucional NÃO é afetado — o matcher abaixo só
 * roda em /portal/*.
 */
export function middleware(_request: NextRequest) {
  // --- Ativar quando o portal ganhar login: ---
  // const session = _request.cookies.get('session')?.value;
  // if (!session) {
  //   const loginUrl = new URL('/login', _request.url);
  //   loginUrl.searchParams.set('redirect', _request.nextUrl.pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};