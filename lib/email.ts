import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export type DadosContato = {
  nome: string;
  email: string;
  telefone?: string;
  mensagem: string;
};

// Escapa HTML para evitar injeção no e-mail (o conteúdo vem do usuário).
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Template branded (estilos inline — exigência dos clientes de e-mail).
function montarHtml(d: DadosContato): string {
  const linha = (label: string, valor: string) =>
    `<tr>
      <td style="padding:6px 0;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:.05em;width:110px;vertical-align:top">${label}</td>
      <td style="padding:6px 0;color:#23262E;font-size:15px">${valor}</td>
    </tr>`;
  return `<!doctype html><html><body style="margin:0;background:#F7F6F2;padding:24px;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #eceae4">
      <tr><td style="background:#0A1E40;padding:20px 28px">
        <div style="color:#C7A96F;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Perazzo &amp; Associados</div>
        <div style="color:#fff;font-size:18px;font-weight:bold;margin-top:4px">Novo contato pelo site</div>
      </td></tr>
      <tr><td style="padding:24px 28px">
        <table role="presentation" width="100%">
          ${linha('Nome', esc(d.nome))}
          ${linha('E-mail', `<a href="mailto:${esc(d.email)}" style="color:#AA8F5D">${esc(d.email)}</a>`)}
          ${linha('Telefone', esc(d.telefone || '—'))}
        </table>
        <div style="margin-top:18px;padding-top:18px;border-top:1px solid #eceae4">
          <div style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Mensagem</div>
          <div style="color:#23262E;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(d.mensagem)}</div>
        </div>
      </td></tr>
      <tr><td style="padding:14px 28px;background:#F7F6F2;color:#6B7280;font-size:12px">
        Enviado pelo formulário do site · responda diretamente para falar com o remetente.
      </td></tr>
    </table>
  </body></html>`;
}

/**
 * Envia a mensagem do formulário para o e-mail institucional.
 * Provedor escolhido por variáveis de ambiente, nesta ordem:
 *   1) SMTP do Zoho (ZOHO_SMTP_USER + ZOHO_SMTP_PASS) — recomendado;
 *   2) Resend (RESEND_API_KEY);
 *   3) nenhum configurado → NÃO falha, retorna 'nao-configurado' (ok em dev).
 */
export async function enviarEmailContato(dados: DadosContato) {
  const subject = `Novo contato pelo site — ${dados.nome}`;
  const text =
    `Nome: ${dados.nome}\n` +
    `E-mail: ${dados.email}\n` +
    `Telefone: ${dados.telefone || '—'}\n\n` +
    `Mensagem:\n${dados.mensagem}`;
  const html = montarHtml(dados);

  const zohoUser = process.env.ZOHO_SMTP_USER;
  const zohoPass = process.env.ZOHO_SMTP_PASS;
  const to = process.env.CONTACT_EMAIL_TO || zohoUser;
  const from = process.env.CONTACT_EMAIL_FROM || (zohoUser ? `Perazzo & Associados <${zohoUser}>` : undefined);

  // 1) Zoho SMTP (preferido)
  if (zohoUser && zohoPass && to && from) {
    const port = Number(process.env.ZOHO_SMTP_PORT || 465);
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
        port,
        secure: port === 465, // 465 = SSL; 587 = STARTTLS
        auth: { user: zohoUser, pass: zohoPass },
      });
      await transporter.sendMail({ from, to, replyTo: dados.email, subject, text, html });
      return { enviado: true as const };
    } catch (err) {
      console.error('[contato] Erro Zoho SMTP:', err instanceof Error ? err.message : err);
      return { enviado: false, motivo: 'erro-envio' as const };
    }
  }

  // 2) Resend (fallback)
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && to) {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: from || 'Perazzo & Associados <onboarding@resend.dev>',
      to,
      replyTo: dados.email,
      subject,
      text,
      html,
    });
    if (error) {
      console.error('[contato] Erro Resend:', error);
      return { enviado: false, motivo: 'erro-envio' as const };
    }
    return { enviado: true as const };
  }

  // 3) Nada configurado
  console.warn('[contato] Nenhum provedor de e-mail configurado (Zoho/Resend) — e-mail NÃO enviado (ok em dev).');
  return { enviado: false, motivo: 'nao-configurado' as const };
}