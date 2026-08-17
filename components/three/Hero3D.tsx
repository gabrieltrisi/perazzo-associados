'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import HeroPoster from './HeroPoster';

// Carrega a cena 3D só no cliente (WebGL não roda no servidor) e sob demanda.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false, loading: () => null });

/**
 * Hero 3D com salvaguardas de performance/acessibilidade:
 * - só ativa depois do mount (não bloqueia o carregamento inicial)
 * - respeita "prefers-reduced-motion" (fallback: só o fundo navy)
 * - desliga em telas muito pequenas (evita travar celular fraco)
 */
export default function Hero3D() {
  const [enabled, setEnabled] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.innerWidth < 640;
    if (!reduced && !isSmall) setEnabled(true);
    setDecided(true);
  }, []);

  // Enquanto decide (ou quando 3D está desligado), mostra o poster estático leve.
  if (!enabled) return decided ? <HeroPoster /> : null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <HeroScene />
    </div>
  );
}