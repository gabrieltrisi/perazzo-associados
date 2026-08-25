// Textura de grão sutil por cima de tudo (ar editorial/analog premium).
// SVG de ruído (feTurbulence) como data URI, fixo, baixa opacidade, sem eventos.
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.045] mix-blend-overlay"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: '140px 140px' }}
    />
  );
}