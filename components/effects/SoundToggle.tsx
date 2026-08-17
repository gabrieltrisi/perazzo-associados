'use client';

import { useEffect, useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { playKnock } from '@/lib/knock';

// Botão discreto para ligar/desligar o som do martelo. Preferência persistida.
export default function SoundToggle() {
  const [on, setOn] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOn(localStorage.getItem('perazzo-sound') !== 'off');
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    localStorage.setItem('perazzo-sound', next ? 'on' : 'off');
    if (next) playKnock(); // prévia ao religar
  }

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Desativar som' : 'Ativar som'}
      title={on ? 'Som ativado' : 'Som desativado'}
      className="fixed bottom-6 left-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-navy/80 text-gold backdrop-blur transition-colors hover:border-gold hover:bg-navy"
    >
      {on ? <FiVolume2 size={18} /> : <FiVolumeX size={18} />}
    </button>
  );
}