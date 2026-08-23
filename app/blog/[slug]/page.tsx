import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Reveal from '@/components/ui/Reveal';
import ShareButtons from '@/components/blog/ShareButtons';
import { LuArrowLeft } from 'react-icons/lu';
import { getAllPosts, getPost } from '@/lib/blog';

function formatarData(d: string) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function tempoLeitura(texto: string) {
  const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article' },
  };
}

// Estilo dos elementos MDX no novo design (títulos em Bodoni, corpo legível).
const mdxComponents = {
  h2: (p: React.ComponentProps<'h2'>) => <h2 className="mt-10 font-serif text-[26px] font-medium text-ink" {...p} />,
  h3: (p: React.ComponentProps<'h3'>) => <h3 className="mt-7 font-serif text-[21px] font-medium text-ink" {...p} />,
  p: (p: React.ComponentProps<'p'>) => <p className="text-[17px] leading-[1.8] text-ink/85" {...p} />,
  ul: (p: React.ComponentProps<'ul'>) => <ul className="list-disc space-y-2 pl-5 text-[17px] leading-[1.8] text-ink/85" {...p} />,
  ol: (p: React.ComponentProps<'ol'>) => <ol className="list-decimal space-y-2 pl-5 text-[17px] leading-[1.8] text-ink/85" {...p} />,
  a: (p: React.ComponentProps<'a'>) => <a className="text-gold-dark underline underline-offset-2 hover:text-gold" {...p} />,
  blockquote: (p: React.ComponentProps<'blockquote'>) => (
    <blockquote className="rounded-r-lg border-l-4 border-gold bg-offwhite p-5 font-serif text-[19px] italic text-muted" {...p} />
  ),
  em: (p: React.ComponentProps<'em'>) => <em className="text-muted" {...p} />,
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || !post.published) notFound();

  return (
    <>
      {/* Hero navy */}
      <section
        className="relative overflow-hidden px-6 pb-[clamp(48px,6vw,80px)] pt-[clamp(120px,14vw,180px)]"
        style={{ background: 'linear-gradient(170deg,#071530 0%,#0A1E40 55%,#0C2149 100%)' }}
      >
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[440px] w-[820px] -translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(199,169,111,.12) 0%, transparent 60%)' }} />
        <div className="relative mx-auto max-w-3xl">
          <Reveal>
            <Link href="/blog" className="inline-flex items-center gap-2 text-[13px] font-semibold text-cloud transition hover:text-gold"><LuArrowLeft className="h-4 w-4" /> Voltar aos artigos</Link>
          </Reveal>
          {post.autor && (
            <Reveal delay={0.05}>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{post.autor}</p>
            </Reveal>
          )}
          <Reveal delay={0.08}>
            <h1 className="mt-3 font-serif text-[clamp(28px,4.2vw,44px)] font-medium leading-[1.15] tracking-[-0.01em] text-white [text-wrap:balance]">{post.title}</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-slate2">
              {post.date && <span>{formatarData(post.date)}</span>}
              {post.date && <span aria-hidden>·</span>}
              <span>{tempoLeitura(post.content)} min de leitura</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Corpo claro */}
      <section
        className="relative bg-gradient-to-b from-white via-offwhite to-cream px-6 py-[clamp(56px,7vw,96px)] text-ink"
        style={{ marginTop: '-2.5vw', clipPath: 'polygon(0 2.5vw, 100% 0, 100% 100%, 0 100%)' }}
      >
        <article className="relative mx-auto max-w-3xl">
          <div className="space-y-5">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
          <div className="mt-12 border-t border-line pt-6">
            <ShareButtons title={post.title} />
          </div>
        </article>
      </section>
    </>
  );
}
