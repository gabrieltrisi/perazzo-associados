'use client';

import { useState } from 'react';
import { FaWhatsapp, FaLinkedinIn, FaLink, FaCheck } from 'react-icons/fa';

// Compartilhar artigo: WhatsApp, LinkedIn e copiar link.
export default function ShareButtons({ title }: { title: string }) {
  const [copiado, setCopiado] = useState(false);
  const url = () => (typeof window !== 'undefined' ? window.location.href : '');

  const abrir = (href: string) => window.open(href, '_blank', 'noopener,noreferrer');

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      /* clipboard indisponível — ignora */
    }
  }

  const btn =
    'grid h-9 w-9 place-items-center rounded-full border border-navy/15 text-navy transition-colors hover:bg-navy hover:text-gold';

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-wide text-muted">Compartilhar</span>
      <button
        type="button"
        onClick={() => abrir(`https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`)}
        aria-label="Compartilhar no WhatsApp"
        className={btn}
      >
        <FaWhatsapp size={16} />
      </button>
      <button
        type="button"
        onClick={() =>
          abrir(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`)
        }
        aria-label="Compartilhar no LinkedIn"
        className={btn}
      >
        <FaLinkedinIn size={16} />
      </button>
      <button type="button" onClick={copiar} aria-label="Copiar link" className={btn}>
        {copiado ? <FaCheck size={15} /> : <FaLink size={15} />}
      </button>
    </div>
  );
}