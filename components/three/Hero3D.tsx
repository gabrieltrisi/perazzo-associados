'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import HeroPoster from './HeroPoster';

// Carrega a cena 3D só no cliente (WebGL não roda no servidor) e sob demanda.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false, loading: () => null });

/**
 * Hero 3D com salvaguardas de performance/acessibilidade:
 * - só ativa depois do mount (não bloqueia o carregamento inicial)
 * - respeita "prefers-reduced-motion" (fallback: só o fundo navy)
 * - desliga em telas muito pequenas (evita travar celular fraco)
 * - PAUSA a renderização quando o Hero sai da viewport (economiza bateria/GPU)
 */
export default function Hero3D() {
  const [enabled, setEnabled] = useState(false);
  const [decided, setDecided] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.innerWidth < 640;
    if (!reduced && !isSmall) setEnabled(true);
    setDecided(true);
  }, []);

  // Pausa/retoma o loop de render conforme o Hero entra/sai da tela.
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [enabled]);

  // Enquanto decide (ou quando 3D está desligado), mostra o poster estático leve.
  if (!enabled) return decided ? <HeroPoster /> : null;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <HeroScene paused={!visible} />
    </div>
  );
}
