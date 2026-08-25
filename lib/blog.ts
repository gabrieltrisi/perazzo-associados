import { prisma } from './db';

// Blog agora vive no banco (editável pelo painel). Antes eram arquivos MDX.
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  autor: string;
  excerpt: string;
};

export type Post = PostMeta & { content: string; published: boolean };

type Row = {
  slug: string;
  title: string;
  description: string;
  date: string;
  autor: string;
  excerpt: string;
  content: string;
  published: boolean;
};

function toMeta(r: Row): PostMeta {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    date: r.date,
    autor: r.autor,
    excerpt: r.excerpt,
  };
}

const ordenar = [{ date: 'desc' as const }, { createdAt: 'desc' as const }];

// Público: só publicados, mais recentes primeiro.
export async function getAllPosts(): Promise<PostMeta[]> {
  try {
    const rows = await prisma.blogPost.findMany({ where: { published: true }, orderBy: ordenar });
    return rows.map(toMeta);
  } catch {
    return [];
  }
}

// Admin: todos (inclui rascunhos).
export async function getAllPostsAdmin(): Promise<Post[]> {
  const rows = await prisma.blogPost.findMany({ orderBy: ordenar });
  return rows.map((r) => ({ ...toMeta(r), content: r.content, published: r.published }));
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const r = await prisma.blogPost.findUnique({ where: { slug } });
    if (!r) return null;
    return { ...toMeta(r), content: r.content, published: r.published };
  } catch {
    return null;
  }
}

// Gera um slug limpo a partir de um texto.
export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}