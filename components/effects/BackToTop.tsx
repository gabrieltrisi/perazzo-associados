'use client';

import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

/** Botão flutuante "voltar ao topo" — aparece depois de rolar um pouco. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toTop() {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Voltar ao topo"
      className={`fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-navy-deep/90 text-gold shadow-soft backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-navy ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <FiArrowUp size={18} />
    </button>
  );
}