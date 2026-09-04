import { ImageResponse } from 'next/og';

// Imagem de preview social padrão do site (WhatsApp, LinkedIn, etc.).
// Gerada no build — sem depender de designer/arquivo estático.
export const alt = 'Perazzo & Associados Advogados';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #071530 0%, #0A1E40 60%, #14294d 100%)',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Monograma gigante ao fundo */}
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            top: '-60px',
            fontSize: 620,
            fontWeight: 800,
            color: '#C7A96F',
            opacity: 0.08,
            lineHeight: 1,
          }}
        >
          P
        </div>

        {/* Barra dourada */}
        <div style={{ display: 'flex', width: 90, height: 6, background: '#C7A96F' }} />

        <div
          style={{
            display: 'flex',
            color: '#C7A96F',
            fontSize: 26,
            letterSpacing: 6,
            marginTop: 28,
          }}
        >
          ADVOCACIA · SALVADOR/BA
        </div>

        <div
          style={{
            display: 'flex',
            color: '#ffffff',
            fontSize: 78,
            fontWeight: 700,
            marginTop: 12,
          }}
        >
          Perazzo &amp; Associados
        </div>

        <div
          style={{
            display: 'flex',
            color: 'rgba(255,255,255,0.82)',
            fontSize: 34,
            marginTop: 18,
            maxWidth: 720,
          }}
        >
          Recuperação tributária e demais áreas do Direito.
        </div>
      </div>
    ),
    { ...size },
  );
}