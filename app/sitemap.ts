import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://perazzoadvogados.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Página única: /sobre, /areas-de-atuacao e /contato agora redirecionam
  // para âncoras da home (308) — por isso não entram no sitemap.
  const rotas = [
    '',
    '/blog',
    '/politica-de-privacidade',
    '/termos-de-uso',
  ];

  const paginas: MetadataRoute.Sitemap = rotas.map((r) => ({
    url: `${SITE}${r}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: r === '' ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = (await getAllPosts()).map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...paginas, ...posts];
}