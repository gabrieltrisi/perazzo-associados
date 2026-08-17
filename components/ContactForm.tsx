'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

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
  if (!SITE_KEY) return undefined;
  await ensureRecaptcha();
  return new Promise((resolve) => {
    window.grecaptcha!.ready(() => {
      window.grecaptcha!.execute(SITE_KEY, { action: 'contato' }).then(resolve);
    });
  });
}

type Estado = 'idle' | 'enviando' | 'sucesso' | 'erro';
type Campos = { nome: string; email: string; mensagem: string };
type Erros = Partial<Record<keyof Campos, string>>;

function validar(c: Campos): Erros {
  const e: Erros = {};
  if (!c.nome.trim()) e.nome = 'Informe seu nome.';
  if (!c.email.trim()) e.email = 'Informe seu e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) e.email = 'E-mail inválido.';
  if (!c.mensagem.trim()) e.mensagem = 'Escreva sua mensagem.';
  return e;
}

function camposDe(form: HTMLFormElement): Campos {
  const fd = new FormData(form);
  return {
    nome: String(fd.get('nome') || ''),
    email: String(fd.get('email') || ''),
    mensagem: String(fd.get('mensagem') || ''),
  };
}

const base =
  'w-full rounded-md border bg-white px-4 py-3 text-ink outline-none transition-colors focus:ring-1';
const ok = 'border-navy-light/30 focus:border-gold focus:ring-gold';
const bad = 'border-red-400 focus:border-red-400 focus:ring-red-300';

export default function ContactForm() {
  const [estado, setEstado] = useState<Estado>('idle');
  const [erro, setErro] = useState('');
  const [consentimento, setConsentimento] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const [tocado, setTocado] = useState<Partial<Record<keyof Campos, boolean>>>({});

  function onBlur(e: React.FocusEvent<HTMLFormElement>) {
    const name = (e.target as unknown as HTMLInputElement).name as keyof Campos;
    if (!['nome', 'email', 'mensagem'].includes(name)) return;
    setTocado((t) => ({ ...t, [name]: true }));
    setErros(validar(camposDe(e.currentTarget)));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const campos = camposDe(form);
    const errs = validar(campos);
    setErros(errs);
    setTocado({ nome: true, email: true, mensagem: true });
    if (Object.keys(errs).length) return;

    setEstado('enviando');
    setErro('');
    try {
      const fd = new FormData(form);
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campos,
          telefone: fd.get('telefone'),
          honeypot: fd.get('website'),
          consentimento,
          recaptchaToken,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.erro || 'Erro ao enviar.');
      setEstado('sucesso');
      form.reset();
      setConsentimento(false);
      setTocado({});
      setErros({});
    } catch (err) {
      setEstado('erro');
      setErro(err instanceof Error ? err.message : 'Erro ao enviar.');
    }
  }

  if (estado === 'sucesso') {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
          <motion.svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M4 12l5 5L20 6"
              stroke="currentColor"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeInOut' }}
            />
          </motion.svg>
        </div>
        <p className="font-serif text-h3 text-success">Mensagem enviada!</p>
        <p className="mt-2 text-sm text-muted">Recebemos o seu contato e responderemos em breve.</p>
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

  const cls = (campo: keyof Campos) =>
    `${base} ${tocado[campo] && erros[campo] ? bad : ok}`;
  const msgErro = (campo: keyof Campos) =>
    tocado[campo] && erros[campo] ? (
      <p className="mt-1 text-xs text-red-600">{erros[campo]}</p>
    ) : null;

  return (
    <form onSubmit={onSubmit} onBlur={onBlur} className="space-y-4" noValidate>
      {/* Honeypot anti-bot (invisível para humanos) */}
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
        <input id="nome" name="nome" type="text" className={cls('nome')} />
        {msgErro('nome')}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">
            E-mail <span className="text-gold">*</span>
          </label>
          <input id="email" name="email" type="email" className={cls('email')} />
          {msgErro('email')}
        </div>
        <div>
          <label htmlFor="telefone" className="mb-1 block text-sm font-medium text-ink">
            Telefone
          </label>
          <input id="telefone" name="telefone" type="tel" className={`${base} ${ok}`} />
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className="mb-1 block text-sm font-medium text-ink">
          Mensagem <span className="text-gold">*</span>
        </label>
        <textarea id="mensagem" name="mensagem" rows={5} className={cls('mensagem')} />
        {msgErro('mensagem')}
      </div>

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