// Itens do menu principal — página única (âncoras) + Blog (rota real).
// href com "/#id" funciona de qualquer página (na Home rola, fora dela navega e rola).
export const NAV = [
  { href: '/#especialidade', label: 'Especialidade' },
  { href: '/#trajetoria', label: 'Trajetória' },
  { href: '/#areas', label: 'Áreas' },
  { href: '/#autoridade', label: 'Autoridade' },
  { href: '/blog', label: 'Blog' },
] as const;
