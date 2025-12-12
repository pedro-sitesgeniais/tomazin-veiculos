import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export function Location() {
  return (
    <section id="contato" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Nossa Localização
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 font-heading">
            Venha nos <span className="text-gradient-gold">visitar</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-card h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.5!2d-47.27!3d-22.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ5JzEyLjAiUyA0N8KwMTYnMTIuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Tomazin Veículos"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-heading mb-1">Endereço</h3>
                <p className="text-muted-foreground">
                  Av. Rebouças, 1500 - Centro
                  <br />
                  Sumaré - SP, 13170-000
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold flex-shrink-0">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-heading mb-1">Horário de Funcionamento</h3>
                <p className="text-muted-foreground">
                  Segunda a Sexta: 8h às 18h
                  <br />
                  Sábado: 8h às 14h
                  <br />
                  Domingo: Fechado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold flex-shrink-0">
                <Phone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-heading mb-1">Telefone</h3>
                <p className="text-muted-foreground">
                  (19) 3873-1234
                  <br />
                  (19) 99999-1234 (WhatsApp)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold flex-shrink-0">
                <Mail className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-heading mb-1">E-mail</h3>
                <p className="text-muted-foreground">
                  contato@tomazinveiculos.com.br
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
