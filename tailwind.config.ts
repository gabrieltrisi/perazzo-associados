import type { Config } from 'tailwindcss';

// ⚠️ Design tokens OFICIAIS — hex copiados ao pé da letra do System Design (doc 03).
// NÃO aproximar, NÃO adicionar cores fora desta lista.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1E40', // fundo principal / institucional
          deep: '#071530', // fundo alternativo mais escuro (footer, seções)
          mid: '#0C2149', // tom intermediário nos gradientes escuros
          light: '#40537B', // painéis internos sobre navy, bordas sutis
        },
        gold: {
          DEFAULT: '#C7A96F', // acento: títulos de seção, ícones, CTAs, divisores
          deep: '#AA8F5D', // hover/estado ativo do dourado
          dark: '#8A6F3C', // dourado escuro (texto/destaque sobre fundo claro)
        },
        offwhite: '#F7F6F2', // fundo de seções claras
        cream: '#EDEBE3', // creme mais escuro (transição de gradiente claro)
        line: '#E5E3DC', // bordas sobre fundo claro
        ink: '#23262E', // texto sobre fundo claro (títulos)
        muted: '#6B7280', // texto secundário / legendas (fundo claro)
        cloud: '#A9B4CC', // texto secundário sobre fundo escuro
        slate2: '#8C9AB8', // texto terciário/legenda sobre fundo escuro
        steel: '#6E85B8', // elemento decorativo sobre navy
        success: '#3F7D5C', // USO ÚNICO: confirmação de formulário enviado
      },
      fontFamily: {
        // Fontes carregadas via next/font em app/layout.tsx (variáveis CSS).
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        tight: ['var(--font-tight)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala tipográfica do doc 03 (desktop). Mobile ajustado nos componentes.
        h1: ['3rem', { lineHeight: '1.2', fontWeight: '700' }], // 48px
        h2: ['2rem', { lineHeight: '1.2', fontWeight: '700' }], // 32px
        h3: ['1.25rem', { lineHeight: '1.2', fontWeight: '700' }], // 20px
        kicker: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '700' }],
      },
      boxShadow: {
        // Sombra SEMPRE suave — nunca sombra dura (regra do design system).
        soft: '0 4px 16px rgba(10, 30, 64, 0.08)',
        'soft-lg': '0 8px 28px rgba(10, 30, 64, 0.12)',
      },
      borderRadius: {
        card: '10px', // cards: 8–12px
      },
      maxWidth: {
        content: '1240px',
      },
    },
  },
  plugins: [],
};

export default config;