import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogForm from '@/components/admin/BlogForm';
import BotaoExcluir from '@/components/admin/BotaoExcluir';
import { getPost } from '@/lib/blog';
import { salvarPost, excluirPost } from '@/app/admin/blog-actions';

export const metadata: Metadata = { title: 'Editar artigo', robots: { index: false } };

export default async function EditarPost({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ salvo?: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const salvo = (await searchParams).salvo === '1';

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/blog" className="text-sm text-muted hover:text-gold">
          ← Voltar
        </Link>
        <Link href={`/blog/${post.slug}`} className="text-sm text-muted hover:text-gold" target="_blank">
          Ver no site ↗
        </Link>
      </div>
      <h1 className="mt-2 text-2xl font-bold text-navy">Editar artigo</h1>

      {salvo && (
        <p className="mt-4 rounded border border-success/30 bg-success/10 px-4 py-2 text-sm text-success">
          ✓ Artigo salvo e publicado.
        </p>
      )}

      <div className="mt-6">
        <BlogForm action={salvarPost} post={post} />
      </div>

      <div className="mt-8 border-t border-navy/10 pt-6">
        <p className="mb-2 text-sm font-semibold text-navy">Zona de perigo</p>
        <form action={excluirPost}>
          <input type="hidden" name="slug" defaultValue={post.slug} />
          <BotaoExcluir>Excluir artigo</BotaoExcluir>
        </form>
      </div>
    </>
  );
}