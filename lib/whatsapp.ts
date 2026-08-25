// Link do WhatsApp com mensagem pré-preenchida. Número vem do ambiente
// (NEXT_PUBLIC_WHATSAPP_NUMBER, formato internacional só dígitos: 5571999999999).
const DEFAULT_MSG = 'Olá! Gostaria de falar com o escritório Perazzo & Associados.';

export function whatsappHref(mensagem: string = DEFAULT_MSG): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const texto = encodeURIComponent(mensagem);
  return numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`;
}