import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Blog 100% baseado em arquivos MDX em content/blog/ — sem CMS (fora de escopo).
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  autor: string;
  excerpt: string;
};

function readMeta(file: string): PostMeta {
  const slug = file.replace(/\.mdx$/, '');
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
  const { data } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ?? '',
    autor: data.autor ?? '',
    excerpt: data.excerpt ?? '',
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map(readMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // mais recente primeiro
}

export function getPost(slug: string): { meta: PostMeta; content: string } | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      date: data.date ?? '',
      autor: data.autor ?? '',
      excerpt: data.excerpt ?? '',
    },
    content,
  };
}