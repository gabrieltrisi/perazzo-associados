import Link from 'next/link';
import { FaInstagram, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import site from '@/content/site-config.json';
import { NAV } from '@/lib/nav';

export default function Footer() {
  const ano = new Date().getFullYear(); // ano dinâmico

  // Só mostra redes que estão realmente preenchidas (ignora placeholders).
  const redes = [
    { href: site.redes.instagram, Icon: FaInstagram, label: 'Instagram' },
    { href: site.redes.linkedin, Icon: FaLinkedinIn, label: 'LinkedIn' },
    { href: site.redes.facebook, Icon: FaFacebookF, label: 'Facebook' },
  ].filter((r) => r.href && !r.href.startsWith('['));

  return (
    <footer className="bg-navy-deep text-white/80">
      <div className="container-px grid gap-10 py-14 md:grid-cols-4">
        {/* Logo textual + endereço */}
        <div>
          <p className="font-serif text-lg font-bold text-white">{site.nomeCompleto}</p>
          <address className="mt-3 whitespace-pre-line not-italic text-sm leading-relaxed text-white/70">
            {site.contato.endereco.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </address>
        </div>

        {/* Navegação */}
        <div>
          <p className="kicker mb-3">Navegação</p>
          <ul className="space-y-2 text-sm">
            {NAV.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="transition-colors hover:text-gold">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato + redes */}
        <div>
          <p className="kicker mb-3">Contato</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`tel:${site.contato.telefoneLink}`} className="hover:text-gold">
                {site.contato.telefoneExibicao}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contato.email}`} className="hover:text-gold">
                {site.contato.email}
              </a>
            </li>
          </ul>
          {redes.length > 0 && (
            <div className="mt-4 flex gap-3">
              {redes.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-light/40 text-gold transition-colors hover:bg-gold hover:text-navy"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Legal */}
        <div>
          <p className="kicker mb-3">Legal</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/politica-de-privacidade" className="hover:text-gold">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="/termos-de-uso" className="hover:text-gold">
                Termos de Uso
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-light/20">
        <div className="container-px py-5 text-xs text-white/50">
          © {ano} {site.nomeCompleto}. Todos os direitos reservados.
          {!site.oab.startsWith('[') && ` · ${site.oab}`}
        </div>
      </div>
    </footer>
  );
}