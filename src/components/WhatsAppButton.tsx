import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '5519999991234';
  const message = 'Olá! Gostaria de mais informações sobre os veículos.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-pulse-gold"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-8 w-8 text-white" />
    </a>
  );
}
