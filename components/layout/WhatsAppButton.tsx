import { FaWhatsapp } from 'react-icons/fa';

/**
 * Botão flutuante de WhatsApp, presente em TODAS as páginas (via layout raiz).
 * Cor: DOURADO sobre NAVY — nunca o verde oficial do WhatsApp (regra do
 * design system, doc 03). Número configurado via NEXT_PUBLIC_WHATSAPP_NUMBER.
 */
export default function WhatsAppButton() {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const mensagem = encodeURIComponent('Olá! Gostaria de falar com o escritório.');
  const href = numero ? `https://wa.me/${numero}?text=${mensagem}` : 'https://wa.me/';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-navy shadow-soft-lg transition-colors hover:bg-gold-deep"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}