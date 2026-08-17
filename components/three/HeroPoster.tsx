// Poster estático do hero — exibido quando a cena 3D não roda (mobile ou
// "reduzir movimento"). SVG leve da balança + brilho dourado; zero JS/WebGL.
export default function HeroPoster() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute right-[-10%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
      <svg
        viewBox="0 0 200 200"
        className="absolute right-4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 text-gold/40 sm:right-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M100 24v132" />
        <path d="M62 150h76" />
        <path d="M40 56h120" />
        <circle cx="100" cy="46" r="6" />
        {/* prato esquerdo */}
        <path d="M40 56l-16 40h32z" />
        <path d="M22 96a18 8 0 0 0 36 0" />
        {/* prato direito */}
        <path d="M160 56l-16 40h32z" />
        <path d="M142 96a18 8 0 0 0 36 0" />
      </svg>
    </div>
  );
}