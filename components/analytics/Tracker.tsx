'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Registra a visita a cada mudança de página (contador próprio, resumo no
// painel). Não roda em /admin. Usa sendBeacon (não bloqueia a navegação).
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    const body = JSON.stringify({ path: pathname });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
      } else {
        void fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        });
      }
    } catch {
      /* ignora falhas de tracking */
    }
  }, [pathname]);

  return null;
}