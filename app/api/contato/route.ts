import { NextResponse } from 'next/server';
import { enviarEmailContato } from '@/lib/email';

// Verifica o reCAPTCHA v3. Se não houver secret configurada, o captcha é
// considerado opcional (dev) e a verificação passa.
async function verificarRecaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
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
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erro: 'Requisição inválida.' }, { status: 400 });
  }

  const nome = String(body.nome ?? '').trim();
  const email = String(body.email ?? '').trim();
  const telefone = String(body.telefone ?? '').trim();
  const mensagem = String(body.mensagem ?? '').trim();
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

  const r = await enviarEmailContato({ nome, email, telefone, mensagem });
  if (!r.enviado && r.motivo === 'erro-envio') {
    return NextResponse.json(
      { ok: false, erro: 'Não foi possível enviar agora. Tente novamente em instantes.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}