import { Resend } from 'resend';

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
    html: montarHtml(dados),
  });

  if (error) {
    console.error('[contato] Erro Resend:', error);
    return { enviado: false, motivo: 'erro-envio' as const };
  }
  return { enviado: true as const };
}