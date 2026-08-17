'use client';

import { usePathname } from 'next/navigation';

// Esconde a "moldura" do site (header, rodapé, cursor, intro, etc.) nas rotas
// do painel /admin — que têm o próprio layout limpo.
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <>{children}</>;
}