'use client';

import { useEffect, useState } from 'react';

/**
 * Intro de carregamento: um véu navy com o monograma "P" da marca que se revela
 * e sobe como cortina. 100% CSS (robusto, funciona sem JS) — ver globals.css.
 * Toca no carregamento completo da página; navegações internas não repetem
 * (o layout persiste). Em reduced-motion, o CSS o esconde.
 * `?shot` na URL pula a intro (screenshots/preview) — inofensivo em produção.
 */
export default function LoadIntro() {
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('shot')) setSkip(true);
  }, []);
  if (skip) return null;
  return (
    <div className="intro-overlay" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/p-mono.png" alt="" className="intro-mono" />
    </div>
  );
}
