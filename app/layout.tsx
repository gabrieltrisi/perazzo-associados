import type { Metadata } from 'next';
import { Cinzel, Mulish } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import SmoothScroll from '@/components/effects/SmoothScroll';
import GrainOverlay from '@/components/effects/GrainOverlay';
import CookieConsent from '@/components/CookieConsent';

// Fontes: Cinzel (serif de títulos — romana, monumental, "justiça") + Mulish
// (sans do corpo, legível). Expostas como variáveis CSS consumidas pelo Tailwind.
const serif = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});
const sans = Mulish({
  subsets: ['latin'],
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
    images: ['/logo-og.webp'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <GrainOverlay />
        <CookieConsent />
      </body>
    </html>
  );
}