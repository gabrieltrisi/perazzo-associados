// Content-Security-Policy: permite só as origens que o site realmente usa
// (self, reCAPTCHA e Google Maps embed) + a toolbar da Vercel (vercel.live),
// que a Vercel injeta APENAS para quem está logado na conta (nunca para os
// visitantes) — liberá-la só evita o erro de console na visão do dono. Bloqueia o resto.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://vercel.live",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://vercel.live https://assets.vercel.com",
  "connect-src 'self' https://www.google.com https://vercel.live wss://ws-us3.pusher.com https://sockjs-us3.pusher.com",
  "frame-src 'self' https://www.google.com https://vercel.live",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

// Cabeçalhos de segurança aplicados a todas as rotas.
const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' }, // anti-clickjacking
  { key: 'X-Content-Type-Options', value: 'nosniff' }, // não "adivinhar" MIME
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload', // força HTTPS
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // Página única: rotas antigas viram âncoras da home (308, preserva SEO).
  async redirects() {
    return [
      { source: '/sobre', destination: '/#trajetoria', permanent: true },
      { source: '/areas-de-atuacao', destination: '/#areas', permanent: true },
      { source: '/contato', destination: '/#contato', permanent: true },
    ];
  },
};

export default nextConfig;