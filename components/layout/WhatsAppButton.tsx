'use client';

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { whatsappHref } from '@/lib/whatsapp';

/**
 * Botão flutuante de WhatsApp, presente em todas as páginas.
 * No mobile ele só aparece depois de rolar um pouco — assim não cobre o hero.
 * Ao passar o mouse (desktop), o rótulo "Fale conosco" desliza para a esquerda.
 * Cor: DOURADO sobre NAVY — nunca o verde oficial do WhatsApp.
 */
export default function WhatsAppButton() {
  const href = whatsappHref();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 260);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className={`group fixed bottom-3 right-3 z-50 flex items-center overflow-hidden rounded-full bg-gold text-navy shadow-soft-lg transition-all duration-300 hover:bg-gold-deep sm:bottom-6 sm:right-6 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[140px] group-hover:pl-5">
        Fale conosco
      </span>
      <span className="grid h-11 w-11 shrink-0 place-items-center sm:h-14 sm:w-14">
        <FaWhatsapp className="h-5 w-5 sm:h-7 sm:w-7" />
      </span>
    </a>
  );
}
