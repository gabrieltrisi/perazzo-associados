import type { Metadata } from 'next';
import { Bodoni_Moda, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import SmoothScroll from '@/components/effects/SmoothScroll';
import GrainOverlay from '@/components/effects/GrainOverlay';
import CookieConsent from '@/components/CookieConsent';
import ScrollProgress from '@/components/effects/ScrollProgress';
import BackToTop from '@/components/effects/BackToTop';
import CustomCursor from '@/components/effects/CustomCursor';
import LoadIntro from '@/components/effects/LoadIntro';
import SoundToggle from '@/components/effects/SoundToggle';
import MotionProvider from '@/components/effects/MotionProvider';
import HideOnAdmin from '@/components/effects/HideOnAdmin';
import { OrganizationJsonLd } from '@/components/StructuredData';
import { Analytics } from '@vercel/analytics/next';
import Tracker from '@/components/analytics/Tracker';

// Duas fontes padronizadas: Bodoni Moda (serif editorial dos títulos) +
// Inter (corpo/UI/números/labels). Expostas como variáveis CSS consumidas pelo Tailwind.
const serif = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-serif',
  display: 'swap',
});
const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://perazzoadvogados.com.br';

// Metadata PADRÃO. Cada página exporta o seu próprio (title/description/OG).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Perazzo & Associados Advogados | Recuperação Tributária em Salvador',
    template: '%s | Perazzo & Associados',
  },
  description:
    'Escritório de advocacia em Salvador (BA) com atuação em recuperação tributária e demais áreas do Direito.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Perazzo & Associados Advogados',
    // A imagem OG é gerada dinamicamente em app/opengraph-image.tsx
    // (e app/blog/[slug]/opengraph-image.tsx para artigos).
  },
  robots: { index: true, follow: true },
  // Favicon/ícones via convenção de arquivo do App Router:
  // app/favicon.ico (16/32/48) + app/icon.png (512) + app/apple-icon.png (180).
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <OrganizationJsonLd />
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <HideOnAdmin>
          <LoadIntro />
          <SmoothScroll />
          <ScrollProgress />
          <CustomCursor />
          <Header />
        </HideOnAdmin>
        <main id="conteudo">
          <MotionProvider>{children}</MotionProvider>
        </main>
        <HideOnAdmin>
          <Footer />
          <WhatsAppButton />
          <BackToTop />
          <SoundToggle />
          <GrainOverlay />
          <CookieConsent />
        </HideOnAdmin>
        <Analytics />
        <Tracker />
      </body>
    </html>
  );
}