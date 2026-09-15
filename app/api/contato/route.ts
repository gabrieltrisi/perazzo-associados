import { NextResponse } from 'next/server';
import { enviarEmailContato } from '@/lib/email';
import { rateLimit, ipDeHeaders } from '@/lib/rate-limit';
import { prisma } from '@/lib/db';

const MAX_BODY = 20_000;
const MAX_NOME = 120;
const MAX_EMAIL = 254;
const MAX_TELEFONE = 40;
const MAX_MENSAGEM = 4000;

// Verifica o reCAPTCHA v3. Se não houver secret configurada, o captcha é
// considerado opcional (dev) e a verificação passa.
async function verificarRecaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== 'production';
  if (!token) return false;
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = (await res.json()) as { success?: boolean; score?: number };
    return data.success === true && (data.score ?? 0) >= 0.5;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  // Rate limit por IP (anti-spam / não queimar a cota do Resend): 5 / 10 min.
  const ip = ipDeHeaders(req.headers);
  if (!(await rateLimit(`contato:${ip}`, 5, 600)).ok) {
    return NextResponse.json(
      { ok: false, erro: 'Muitas mensagens em pouco tempo. Aguarde alguns minutos.' },
      { status: 429 },
    );
  }

  const contentLength = Number(req.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY) {
    return NextResponse.json({ ok: false, erro: 'Mensagem muito grande.' }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ ok: false, erro: 'Mensagem muito grande.' }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, erro: 'Requisição inválida.' }, { status: 400 });
  }

  const nomeRaw = String(body.nome ?? '').trim();
  const emailRaw = String(body.email ?? '').trim();
  const telefoneRaw = String(body.telefone ?? '').trim();
  const mensagemRaw = String(body.mensagem ?? '').trim();
  const nome = nomeRaw.slice(0, MAX_NOME);
  const email = emailRaw.slice(0, MAX_EMAIL);
  const telefone = telefoneRaw.slice(0, MAX_TELEFONE);
  const mensagem = mensagemRaw.slice(0, MAX_MENSAGEM);
  const consentimento = body.consentimento === true;
  const recaptchaToken = body.recaptchaToken as string | undefined;
  const honeypot = String(body.honeypot ?? '').trim();

  // Honeypot preenchido = bot. Finge sucesso (não entrega pista) e descarta.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  // Validação de campos obrigatórios
  if (!nome || !email || !mensagem) {
    return NextResponse.json(
      { ok: false, erro: 'Preencha nome, e-mail e mensagem.' },
      { status: 400 },
    );
  }
  if (
    nomeRaw.length > MAX_NOME ||
    emailRaw.length > MAX_EMAIL ||
    telefoneRaw.length > MAX_TELEFONE ||
    mensagemRaw.length > MAX_MENSAGEM
  ) {
    return NextResponse.json({ ok: false, erro: 'Mensagem muito grande.' }, { status: 413 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, erro: 'Informe um e-mail válido.' }, { status: 400 });
  }
  // Consentimento LGPD obrigatório
  if (!consentimento) {
    return NextResponse.json(
      { ok: false, erro: 'É necessário aceitar o consentimento de dados (LGPD).' },
      { status: 400 },
    );
  }
  // Anti-spam
  if (!(await verificarRecaptcha(recaptchaToken))) {
    return NextResponse.json({ ok: false, erro: 'Falha na verificação anti-spam.' }, { status: 400 });
  }

  // Salva o lead no banco ANTES de enviar — assim o contato nunca se perde,
  // mesmo que o envio de e-mail falhe. Falha aqui não derruba o formulário.
  try {
    await prisma.lead.create({ data: { nome, email, telefone, mensagem, ip } });
  } catch (e) {
    console.error('[contato] falha ao salvar lead:', e instanceof Error ? e.message : e);
  }

  const r = await enviarEmailContato({ nome, email, telefone, mensagem });
  if (!r.enviado && r.motivo === 'erro-envio') {
    return NextResponse.json(
      { ok: false, erro: 'Não foi possível enviar agora. Tente novamente em instantes.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
