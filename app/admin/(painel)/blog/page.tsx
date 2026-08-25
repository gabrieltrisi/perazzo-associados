import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPostsAdmin } from '@/lib/blog';

export const metadata: Metadata = { title: 'Blog', robots: { index: false } };

export default async function AdminBlog({
  searchParams,
}: {
  searchParams: Promise<{ excluido?: string }>;
}) {
  const posts = await getAllPostsAdmin();
  const excluido = (await searchParams).excluido === '1';

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Artigos do blog</h1>
        <Link
          href="/admin/blog/novo"
          className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-deep"
        >
          + Novo artigo
        </Link>
      </div>

      {excluido && (
        <p className="mt-4 rounded border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
          ✓ Artigo excluído.
        </p>
      )}

      {posts.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-muted/30 bg-white/60 p-6 text-sm text-muted">
          Nenhum artigo ainda. Clique em “Novo artigo” para criar o primeiro.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-navy/10 overflow-hidden rounded-card border border-navy/10 bg-white">
          {posts.map((p) => (
            <li key={p.slug} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <Link href={`/admin/blog/${p.slug}`} className="font-serif text-navy hover:text-gold">
                  {p.title || '(sem título)'}
                </Link>
                <p className="truncate text-xs text-muted">
                  /{p.slug} {p.date && `· ${p.date}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    p.published ? 'bg-success/10 text-success' : 'bg-muted/15 text-muted'
                  }`}
                >
                  {p.published ? 'Publicado' : 'Rascunho'}
                </span>
                <Link href={`/admin/blog/${p.slug}`} className="text-sm font-semibold text-gold">
                  Editar →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}