import type { Metadata } from 'next';
import Link from 'next/link';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import TiltCard from '@/components/ui/TiltCard';
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
      <Section variant="navy">
        <Reveal>
          <div className="py-6">
            <span className="kicker">Conteúdo</span>
            <span className="gold-rule mt-3" />
            <h1 className="mt-6 text-[2rem] font-bold sm:text-h1">Artigos e Publicações</h1>
          </div>
        </Reveal>
      </Section>

      <Section variant="light">
        {posts.length === 0 ? (
          <p className="text-muted">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((p, idx) => (
              <Reveal key={p.slug} delay={idx * 0.08} className="h-full">
                <Link href={`/blog/${p.slug}`} className="block h-full">
                  <TiltCard>
                    <p className="text-kicker uppercase tracking-wide text-gold">{formatDate(p.date)}</p>
                    <h3 className="mt-2 text-h3 text-navy">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-gold">Ler artigo →</span>
                  </TiltCard>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}