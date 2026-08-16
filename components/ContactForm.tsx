'use client';

import { useState } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

// Carrega o script do reCAPTCHA v3 sob demanda (só se houver site key).
function ensureRecaptcha(): Promise<void> {
  return new Promise((resolve) => {
    if (!SITE_KEY || window.grecaptcha) return resolve();
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

async function getRecaptchaToken(): Promise<string | undefined> {
  if (!SITE_KEY) return undefined; // opcional em dev
  await ensureRecaptcha();
  return new Promise((resolve) => {
    window.grecaptcha!.ready(() => {
      window.grecaptcha!.execute(SITE_KEY, { action: 'contato' }).then(resolve);
    });
  });
}

type Estado = 'idle' | 'enviando' | 'sucesso' | 'erro';

const inputBase =
  'w-full rounded-md border border-navy-light/30 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold';

export default function ContactForm() {
  const [estado, setEstado] = useState<Estado>('idle');
  const [erro, setErro] = useState('');
  const [consentimento, setConsentimento] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado('enviando');
    setErro('');
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: fd.get('nome'),
          email: fd.get('email'),
          telefone: fd.get('telefone'),
          mensagem: fd.get('mensagem'),
          honeypot: fd.get('website'), // armadilha anti-bot (deve vir vazio)
          consentimento,
          recaptchaToken,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.erro || 'Erro ao enviar.');
      setEstado('sucesso');
      form.reset();
      setConsentimento(false);
    } catch (err) {
      setEstado('erro');
      setErro(err instanceof Error ? err.message : 'Erro ao enviar.');
    }
  }

  if (estado === 'sucesso') {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-6 text-center">
        <p className="font-serif text-h3 text-success">Mensagem enviada!</p>
        <p className="mt-2 text-sm text-muted">
          Recebemos o seu contato e responderemos em breve.
        </p>
        <button
          type="button"
          onClick={() => setEstado('idle')}
          className="mt-4 text-sm font-semibold text-gold hover:text-gold-deep"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* Honeypot: campo invisível para humanos; se um bot preencher, o envio é descartado. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
      />

      <div>
        <label htmlFor="nome" className="mb-1 block text-sm font-medium text-ink">
          Nome <span className="text-gold">*</span>
        </label>
        <input id="nome" name="nome" type="text" required className={inputBase} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
            E-mail <span className="text-gold">*</span>
          </label>
          <input id="email" name="email" type="email" required className={inputBase} />
        </div>
        <div>
          <label htmlFor="telefone" className="mb-1 block text-sm font-medium text-ink">
            Telefone
          </label>
          <input id="telefone" name="telefone" type="tel" className={inputBase} />
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className="mb-1 block text-sm font-medium text-ink">
          Mensagem <span className="text-gold">*</span>
        </label>
        <textarea id="mensagem" name="mensagem" rows={5} required className={inputBase} />
      </div>

      {/* Consentimento LGPD — obrigatório para habilitar o envio */}
      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          checked={consentimento}
          onChange={(e) => setConsentimento(e.target.checked)}
          className="mt-1 h-4 w-4 accent-gold"
        />
        <span>
          Autorizo o tratamento dos meus dados para fins de contato, conforme a{' '}
          <a href="/politica-de-privacidade" className="text-gold underline">
            Política de Privacidade
          </a>
          . <span className="text-gold">*</span>
        </span>
      </label>

      {estado === 'erro' && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={!consentimento || estado === 'enviando'}
        className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 font-sans text-sm font-semibold tracking-wide text-navy transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {estado === 'enviando' ? 'Enviando…' : 'Enviar mensagem'}
      </button>

      {SITE_KEY && (
        <p className="text-xs text-muted">
          Protegido por reCAPTCHA. Aplicam-se a Política de Privacidade e os Termos do Google.
        </p>
      )}
    </form>
  );
}