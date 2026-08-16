'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import Logo from './Logo';
import { NAV } from '@/lib/nav';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Sombra sutil ao rolar a página.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu mobile ao trocar de página.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 bg-navy transition-shadow ${scrolled ? 'shadow-soft' : ''}`}
    >
      <div className="container-px flex h-20 items-center justify-between">
        <Link href="/" aria-label="Página inicial — Perazzo & Associados">
          <Logo />
        </Link>

        {/* Menu desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-sans text-sm tracking-wide transition-colors ${
                  active ? 'text-gold' : 'text-white/90 hover:text-gold'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Botão do menu mobile */}
        <button
          type="button"
          className="text-white md:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="border-t border-navy-light/30 bg-navy md:hidden">
          <div className="container-px flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-3 font-sans text-sm ${
                  pathname === item.href ? 'text-gold' : 'text-white/90'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}