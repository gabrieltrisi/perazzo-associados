'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/admin-session';
import { prisma } from '@/lib/db';
import { slugify } from '@/lib/blog';

async function exigirAdmin() {
  if (!(await getAdmin())) redirect('/admin/login');
}

function campos(fd: FormData) {
  return {
    title: String(fd.get('title') ?? '').trim(),
    description: String(fd.get('description') ?? '').trim(),
    excerpt: String(fd.get('excerpt') ?? '').trim(),
    autor: String(fd.get('autor') ?? '').trim(),
    date: String(fd.get('date') ?? '').trim(),
    content: String(fd.get('content') ?? ''),
    published: fd.get('published') === 'on' || fd.get('published') === 'true',
  };
}

async function slugUnico(base: string, ignorar?: string): Promise<string> {
  let slug = base;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (true) {
    const existe = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existe || existe.slug === ignorar) return slug;
    slug = `${base}-${++n}`;
  }
}

export async function criarPost(fd: FormData) {
  await exigirAdmin();
  const c = campos(fd);
  const base = slugify(String(fd.get('slug') || '') || c.title) || 'artigo';
  const slug = await slugUnico(base);
  await prisma.blogPost.create({ data: { ...c, slug } });
  revalidatePath('/blog');
  redirect(`/admin/blog/${slug}?salvo=1`);
}

export async function salvarPost(fd: FormData) {
  await exigirAdmin();
  const original = String(fd.get('slugOriginal') ?? '');
  const c = campos(fd);
  const base = slugify(String(fd.get('slug') || '') || c.title) || original;
  const slug = base === original ? original : await slugUnico(base, original);
  await prisma.blogPost.update({ where: { slug: original }, data: { ...c, slug } });
  revalidatePath('/blog');
  revalidatePath(`/blog/${original}`);
  revalidatePath(`/blog/${slug}`);
  redirect(`/admin/blog/${slug}?salvo=1`);
}

export async function excluirPost(fd: FormData) {
  await exigirAdmin();
  const slug = String(fd.get('slug') ?? '');
  await prisma.blogPost.delete({ where: { slug } });
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  redirect('/admin/blog?excluido=1');
}