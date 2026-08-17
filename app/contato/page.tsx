import type { Metadata } from 'next';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import ContactForm from '@/components/ContactForm';
import { whatsappHref } from '@/lib/whatsapp';
import site from '@/content/site-config.json';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com o Perazzo & Associados Advogados em Salvador (BA): telefone, e-mail, WhatsApp e endereço.',
  alternates: { canonical: '/contato' },
};

function ContatoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
        {icon}
      </span>
      <div>
        <p className="text-kicker uppercase tracking-wide text-gold">{label}</p>
        <div className="mt-1 text-ink/90">{children}</div>
      </div>
    </div>
  );
}

export default function ContatoPage() {
  const maps = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;
  const wppHref = whatsappHref('Olá! Vim pelo site e gostaria de tirar uma dúvida com o escritório.');

  return (
    <>
      <Section variant="navy">
        <Reveal>
          <div className="max-w-2xl py-6">
            <span className="kicker">Contato</span>
            <span className="gold-rule mt-3" />
            <h1 className="mt-6 text-[2rem] font-bold sm:text-h1">Fale com o escritório</h1>
            <p className="mt-4 text-white/80">
              Envie sua mensagem pelo formulário ou fale diretamente pelos canais abaixo.
            </p>
          </div>
        </Reveal>
      </Section>

      <Section variant="light">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-6">
              <ContatoItem icon={<FaPhone size={16} />} label="Telefone">
                <a href={`tel:${site.contato.telefoneLink}`} className="hover:text-gold">
                  {site.contato.telefoneExibicao}
                </a>
              </ContatoItem>
              <ContatoItem icon={<FaEnvelope size={16} />} label="E-mail">
                <a href={`mailto:${site.contato.email}`} className="hover:text-gold">
                  {site.contato.email}
                </a>
              </ContatoItem>
              <ContatoItem icon={<FaWhatsapp size={18} />} label="WhatsApp">
                <a href={wppHref} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                  Conversar no WhatsApp
                </a>
              </ContatoItem>
              <ContatoItem icon={<FaMapMarkerAlt size={16} />} label="Endereço">
                <address className="not-italic">
                  {site.contato.endereco.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </ContatoItem>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-card bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-h3 text-navy">Envie uma mensagem</h2>
              <div className="mt-5">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section variant="light">
        <Reveal>
          {maps ? (
            <div className="h-[360px] w-full overflow-hidden rounded-card shadow-soft">
              <iframe
                src={maps}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do escritório no mapa"
              />
            </div>
          ) : (
            <p className="rounded-card border border-dashed border-muted/40 p-6 text-sm text-muted">
              [PLACEHOLDER — configure <code>NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL</code> no .env.local
              para exibir o mapa do endereço aqui.]
            </p>
          )}
        </Reveal>
      </Section>
    </>
  );
}