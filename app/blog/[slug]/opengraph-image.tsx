import { ImageResponse } from 'next/og';
import { getPost } from '@/lib/blog';

// OG por artigo: mostra o título do post na arte branded.
export const alt = 'Artigo — Perazzo & Associados';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function BlogOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const titulo = post?.meta.title ?? 'Perazzo & Associados';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #071530 0%, #0A1E40 65%, #14294d 100%)',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: 80, height: 6, background: '#C7A96F' }} />
          <div style={{ display: 'flex', color: '#C7A96F', fontSize: 24, letterSpacing: 5, marginTop: 24 }}>
            ARTIGO
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            color: '#ffffff',
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 960,
          }}
        >
          {titulo}
        </div>

        <div style={{ display: 'flex', color: 'rgba(255,255,255,0.75)', fontSize: 30 }}>
          Perazzo &amp; Associados Advogados
        </div>
      </div>
    ),
    { ...size },
  );
}