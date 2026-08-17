import { FaWhatsapp } from 'react-icons/fa';

/**
 * Botão flutuante de WhatsApp, presente em todas as páginas.
 * Ao passar o mouse, o rótulo "Fale conosco" desliza para a esquerda.
 * Cor: DOURADO sobre NAVY — nunca o verde oficial do WhatsApp.
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
      className="group fixed bottom-5 right-5 z-50 flex items-center overflow-hidden rounded-full bg-gold text-navy shadow-soft-lg transition-colors hover:bg-gold-deep"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[140px] group-hover:pl-5">
        Fale conosco
      </span>
      <span className="grid h-14 w-14 shrink-0 place-items-center">
        <FaWhatsapp size={28} />
      </span>
    </a>
  );
}