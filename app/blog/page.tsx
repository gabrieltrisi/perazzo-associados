import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { LuArrowUpRight } from 'react-icons/lu';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Artigos e Publicações',
  description: 'Conteúdos informativos sobre direito tributário e temas jurídicos de interesse.',
  alternates: { canonical: '/blog' },
};

function formatDate(d: string) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-6 pb-[clamp(64px,7vw,96px)] pt-[clamp(120px,14vw,180px)]"
        style={{ background: 'linear-gradient(170deg,#071530 0%,#0A1E40 55%,#0C2149 100%)' }}
      >
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(199,169,111,.12) 0%, transparent 60%)' }} />
        <div className="relative mx-auto max-w-content">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Conteúdo</span>
              <span className="block h-0.5 w-16 bg-gold" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 font-serif text-[clamp(32px,5vw,52px)] font-medium tracking-[-0.02em] text-white">Artigos &amp; <span className="text-gold">Publicações</span></h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.7] text-cloud">Conteúdos sobre recuperação tributária, reforma (IBS/CBS) e temas jurídicos de interesse de empresas.</p>
          </Reveal>
        </div>
      </section>

      {/* Lista */}
      <section
        className="relative bg-gradient-to-b from-white via-offwhite to-cream px-6 py-[clamp(72px,8vw,120px)] text-ink"
        style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 2.5vw, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div className="relative mx-auto max-w-content">
          {posts.length === 0 ? (
            <p className="text-muted">Nenhum artigo publicado ainda.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, idx) => (
                <Reveal key={p.slug} delay={(idx % 3) * 0.08} className="h-full">
                  <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-[0_10px_30px_rgba(10,30,64,.06)] transition duration-200 hover:-translate-y-1 hover:border-gold">
                    <p className="font-sans text-[13px] font-medium tracking-[0.1em] text-gold-dark">{formatDate(p.date)}</p>
                    <h3 className="mt-3 font-serif text-[22px] font-medium leading-[1.3] text-ink">{p.title}</h3>
                    <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-muted">{p.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-dark transition group-hover:text-gold">Ler artigo <LuArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
