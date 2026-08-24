import Reveal from '@/components/ui/Reveal';
import ContactForm from '@/components/ContactForm';
import { whatsappHref } from '@/lib/whatsapp';
import { LuPhone, LuMail, LuMapPin } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa';
import type { SiteConfig } from '@/lib/site-content';

type Props = {
  content: { titulo: string; tituloDestaque?: string; subtitulo: string };
  site: SiteConfig;
};

export default function Contato({ content, site }: Props) {
  const { titulo, tituloDestaque, subtitulo } = content;
  const tp = tituloDestaque ? titulo.split(tituloDestaque) : [titulo];
  const c = site.contato;

  // Mapa: mantido da nossa versão (o design do colega não tem). URL configurável, senão pina o prédio.
  const predio = (c.endereco[0] || site.nomeCompleto).split(/[,—]/)[0].trim();
  const enderecoQuery = encodeURIComponent(`${predio}, Salvador - BA`);
  const maps = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || `https://www.google.com/maps?q=${enderecoQuery}&output=embed`;
  const wpp = whatsappHref('Olá! Vim pelo site e gostaria de conversar com o escritório.');

  return (
    <section
      id="contato"
      data-screen-label="Contato"
      className="relative overflow-hidden px-6 py-[120px]"
      style={{ background: 'radial-gradient(90% 70% at 50% 0%, #0C2149 0%, #071530 62%)' }}
    >
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(199,169,111,.1) 0%, transparent 60%)' }} />
      <div className="relative mx-auto max-w-content">
        <div className="max-w-[720px]">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Contato</span>
              <span className="block h-0.5 w-16 bg-gold" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-serif text-[clamp(28px,3.4vw,40px)] font-medium tracking-[-0.01em] text-white [text-wrap:balance]">{tp[0]}<span className="text-gold">{tituloDestaque}</span>{tp[1] ?? ''}</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-[17px] leading-[1.7] text-cloud">{subtitulo}</p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Canais + mapa */}
          <Reveal>
            <div className="flex flex-col gap-4">
              <a href={`tel:${c.telefoneLink}`} className="group flex items-center gap-4 rounded-xl border border-gold/20 bg-navy-deep/40 p-4 transition hover:border-gold/50">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gold/15 text-gold"><LuPhone className="h-5 w-5" /></span>
                <span><span className="block text-[11px] uppercase tracking-[0.12em] text-gold">Telefone</span><span className="text-[15px] text-white">{c.telefoneExibicao}</span></span>
              </a>
              <a href={`mailto:${c.email}?subject=${encodeURIComponent('Contato pelo site — Perazzo & Associados')}`} className="group flex items-center gap-4 rounded-xl border border-gold/20 bg-navy-deep/40 p-4 transition hover:border-gold/50">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gold/15 text-gold"><LuMail className="h-5 w-5" /></span>
                <span><span className="block text-[11px] uppercase tracking-[0.12em] text-gold">E-mail</span><span className="break-all text-[15px] text-white">{c.email}</span></span>
              </a>
              <a href={wpp} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-xl border border-gold/20 bg-navy-deep/40 p-4 transition hover:border-gold/50">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gold/15 text-gold"><FaWhatsapp className="h-5 w-5" /></span>
                <span><span className="block text-[11px] uppercase tracking-[0.12em] text-gold">WhatsApp</span><span className="text-[15px] text-white">Conversar agora</span></span>
              </a>
              <div className="flex items-start gap-4 rounded-xl border border-gold/20 bg-navy-deep/40 p-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gold/15 text-gold"><LuMapPin className="h-5 w-5" /></span>
                <span><span className="block text-[11px] uppercase tracking-[0.12em] text-gold">Endereço</span><address className="mt-0.5 not-italic text-[14px] leading-[1.6] text-cloud">{c.endereco.map((l) => <span key={l} className="block">{l}</span>)}</address></span>
              </div>

              {/* Mapa (mantido da nossa versão) */}
              <div className="mt-1 h-[260px] w-full overflow-hidden rounded-xl border border-gold/20">
                <iframe src={maps} className="h-full w-full border-0 [filter:grayscale(.2)]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Localização do escritório no mapa" />
              </div>
            </div>
          </Reveal>

          {/* Formulário */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-gold/25 bg-navy-deep/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur-sm sm:p-8">
              <h3 className="font-serif text-[22px] font-medium text-white">Envie uma mensagem</h3>
              <p className="mt-2 text-[14px] text-slate2">Respondemos no mesmo dia útil, sempre que possível.</p>
              <div className="mt-6 [&_label]:text-cloud">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
