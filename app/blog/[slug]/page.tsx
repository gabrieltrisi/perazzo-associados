import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import ShareButtons from '@/components/blog/ShareButtons';
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

// Gera as páginas estáticas dos posts existentes (sem CMS).
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.meta.title, description: post.meta.description, type: 'article' },
  };
}

// Estilo dos elementos MDX (o blog não usa plugin de prose).
const mdxComponents = {
  h2: (p: React.ComponentProps<'h2'>) => <h2 className="mt-8 text-h3 text-navy" {...p} />,
  h3: (p: React.ComponentProps<'h3'>) => <h3 className="mt-6 text-lg font-bold text-navy" {...p} />,
  p: (p: React.ComponentProps<'p'>) => <p className="leading-relaxed text-ink/90" {...p} />,
  ul: (p: React.ComponentProps<'ul'>) => <ul className="list-disc space-y-1 pl-5 text-ink/90" {...p} />,
  a: (p: React.ComponentProps<'a'>) => <a className="text-gold underline" {...p} />,
  blockquote: (p: React.ComponentProps<'blockquote'>) => (
    <blockquote className="rounded-r border-l-4 border-gold bg-offwhite p-4 italic text-muted" {...p} />
  ),
  em: (p: React.ComponentProps<'em'>) => <em className="text-muted" {...p} />,
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <Section variant="light">
      <Reveal>
        <article className="mx-auto max-w-3xl">
          <p className="text-kicker uppercase tracking-wide text-gold">{post.meta.autor}</p>
          <h1 className="mt-2 text-[2rem] font-bold text-navy sm:text-h1">{post.meta.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            {post.meta.date && <span>{formatarData(post.meta.date)}</span>}
            {post.meta.date && <span aria-hidden>·</span>}
            <span>{tempoLeitura(post.content)} min de leitura</span>
          </div>
          <div className="mt-6 space-y-4">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
          <div className="mt-10 border-t border-navy/10 pt-6">
            <ShareButtons title={post.meta.title} />
          </div>
        </article>
      </Reveal>
    </Section>
  );
}