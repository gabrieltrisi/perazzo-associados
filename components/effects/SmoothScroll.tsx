'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Scroll suave/inercial (Lenis) no site inteiro. Expõe a instância em
 * window.__lenis para outros componentes (ex.: "voltar ao topo").
 * Respeita "prefers-reduced-motion": se ligado, não ativa.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}