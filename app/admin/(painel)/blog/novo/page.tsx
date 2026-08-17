import type { Metadata } from 'next';
import Link from 'next/link';
import BlogForm from '@/components/admin/BlogForm';
import { criarPost } from '@/app/admin/blog-actions';

export const metadata: Metadata = { title: 'Novo artigo', robots: { index: false } };

export default function NovoPost() {
  const hoje = new Date().toISOString().slice(0, 10);
  return (
    <>
      <Link href="/admin/blog" className="text-sm text-muted hover:text-gold">
        ← Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-navy">Novo artigo</h1>
      <div className="mt-6">
        <BlogForm action={criarPost} isNew post={{ date: hoje, autor: '', published: true }} />
      </div>
    </>
  );
}