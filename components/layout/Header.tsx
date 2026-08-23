'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { LuArrowUpRight } from 'react-icons/lu';
import Logo from './Logo';
import { NAV } from '@/lib/nav';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Scroll-spy: destaca no menu a seção que está no centro da viewport.
  useEffect(() => {
    const ids = NAV.map((i) => (i.href.startsWith('/#') ? i.href.slice(2) : null)).filter(Boolean) as string[];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [pathname]);

  // Transparente só na home (sobre o Hero 3D); sólido nas demais rotas e ao rolar.
  const solid = scrolled || pathname !== '/';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'border-b border-gold/15 bg-navy-deep/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-content items-center justify-between px-6">
        <Link href="/" aria-label="Página inicial — Perazzo & Associados" className="flex items-center">
          <Logo />
        </Link>

        {/* Pill-nav desktop */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-navy-deep/40 px-2 py-1.5 backdrop-blur-sm lg:flex">
          {NAV.map((item) => {
            const on = item.href === `/#${active}`;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? 'true' : undefined}
                className={`rounded-full px-4 py-2 font-sans text-[13.5px] font-medium transition hover:bg-gold/15 hover:text-gold ${on ? 'bg-gold/15 text-gold' : 'text-white/85'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA desktop */}
        <Link
          href="/#contato"
          className="group hidden items-center gap-2.5 whitespace-nowrap rounded-full bg-gold py-[6px] pl-5 pr-[6px] text-[14px] font-semibold text-navy-deep transition hover:bg-gold-deep lg:inline-flex"
        >
          Falar com o escritório
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-deep text-gold transition group-hover:translate-x-0.5"><LuArrowUpRight className="h-4 w-4" /></span>
        </Link>

        {/* Botão mobile */}
        <button
          type="button"
          className="text-white lg:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="border-t border-gold/15 bg-navy-deep/95 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-content flex-col px-6 py-3">
            {NAV.map((item) => {
              const on = item.href === `/#${active}`;
              return (
                <Link key={item.href} href={item.href} aria-current={on ? 'true' : undefined} className={`border-b border-white/5 py-3.5 font-sans text-[15px] last:border-0 ${on ? 'text-gold' : 'text-white/90'}`}>
                  {item.label}
                </Link>
              );
            })}
            <Link href="/#contato" className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gold py-3 text-[15px] font-semibold text-navy-deep">
              Falar com o escritório <LuArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
