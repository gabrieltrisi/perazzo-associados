// "Toc" de martelo sintetizado via Web Audio — sem arquivo externo (CSP-safe).
// Respeita a preferência de som guardada em localStorage ('perazzo-sound').

let ctx: AudioContext | null = null;

export function soundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('perazzo-sound') !== 'off'; // ligado por padrão
}

export function playKnock() {
  if (typeof window === 'undefined' || !soundEnabled()) return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;

    // Corpo grave curto (a "madeira").
    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = 'triangle';
    body.frequency.setValueAtTime(190, now);
    body.frequency.exponentialRampToValueAtTime(80, now + 0.07);
    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.32, now + 0.004);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
    body.connect(bodyGain).connect(ctx.destination);
    body.start(now);
    body.stop(now + 0.15);

    // Ataque agudo bem curto (o "toc").
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = 'square';
    click.frequency.setValueAtTime(1300, now);
    click.frequency.exponentialRampToValueAtTime(520, now + 0.03);
    clickGain.gain.setValueAtTime(0.12, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    click.connect(clickGain).connect(ctx.destination);
    click.start(now);
    click.stop(now + 0.05);
  } catch {
    // Áudio indisponível — ignora silenciosamente.
  }
}