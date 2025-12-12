import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';
import logo from '@/assets/logo-tomazin.png';

const quickLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Estoque', href: '#estoque' },
  { label: 'Financiamento', href: '#financiamento' },
  { label: 'Avalie seu Veículo', href: '#avalie' },
  { label: 'Quem Somos', href: '#quem-somos' },
  { label: 'Contato', href: '#contato' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <img
              src={logo}
              alt="Tomazin Veículos"
              className="h-12 w-auto mb-6"
            />
            <p className="text-muted-foreground max-w-md mb-6">
              Há mais de 58 anos realizando o sonho de milhares de clientes em Sumaré e região. 
              Venha conhecer nossa loja e encontre o veículo ideal para você.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 font-heading">Links Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6 font-heading">Contato</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>Av. Rebouças, 1500 - Centro</p>
              <p>Sumaré - SP, 13170-000</p>
              <p className="pt-2">(19) 3873-1234</p>
              <p>(19) 99999-1234</p>
              <p className="pt-2">contato@tomazinveiculos.com.br</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Tomazin Veículos. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
