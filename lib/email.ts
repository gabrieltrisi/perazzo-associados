import { Resend } from 'resend';

export type DadosContato = {
  nome: string;
  email: string;
  telefone?: string;
  mensagem: string;
};

/**
 * Envia a mensagem do formulário para o e-mail institucional via Resend.
 * Se as variáveis não estiverem configuradas (ex.: em dev), NÃO falha —
 * apenas registra e retorna `enviado: false` com motivo 'nao-configurado'.
 */
export async function enviarEmailContato(dados: DadosContato) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM || 'Perazzo & Associados <onboarding@resend.dev>';

  if (!apiKey || !to) {
    console.warn('[contato] RESEND_API_KEY/CONTACT_EMAIL_TO ausentes — e-mail NÃO enviado (ok em dev).');
    return { enviado: false, motivo: 'nao-configurado' as const };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: dados.email,
    subject: `Novo contato pelo site — ${dados.nome}`,
    text:
      `Nome: ${dados.nome}\n` +
      `E-mail: ${dados.email}\n` +
      `Telefone: ${dados.telefone || '—'}\n\n` +
      `Mensagem:\n${dados.mensagem}`,
  });

  if (error) {
    console.error('[contato] Erro Resend:', error);
    return { enviado: false, motivo: 'erro-envio' as const };
  }
  return { enviado: true as const };
}