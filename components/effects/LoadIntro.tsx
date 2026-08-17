/**
 * Intro de carregamento: um véu navy com o monograma "P" que se revela e sobe
 * como cortina. 100% CSS (robusto, funciona sem JS) — ver globals.css.
 * Toca no carregamento completo da página; navegações internas não repetem
 * (o layout persiste). Em reduced-motion, o CSS o esconde.
 */
export default function LoadIntro() {
  return (
    <div className="intro-overlay" aria-hidden>
      <span className="intro-mono">P</span>
    </div>
  );
}