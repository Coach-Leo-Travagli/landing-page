import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-fitness-dark text-white py-16">
      <div className="container mx-auto px-4">
        {/* CTA Section */}
        <div className="text-center mb-16 py-12 bg-fitness-gradient rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Pronto Para Começar Sua Transformação?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já transformaram seus corpos e vidas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" className="bg-white text-primary hover:bg-white/90">
              Iniciar Teste Grátis
            </Button>
            <Button variant="outline-hero" size="xl" className="border-white text-white hover:bg-white hover:text-primary">
              Agendar Consultoria
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-black mb-6 text-gradient">FitCoach Pro</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transformando vidas através de coaching personalizado de fitness e nutrição. 
              Sua jornada para um você mais saudável e forte começa aqui.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary !rounded-full flex items-center justify-center hover:bg-primary-light transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary !rounded-full flex items-center justify-center hover:bg-primary-light transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary !rounded-full flex items-center justify-center hover:bg-primary-light transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary !rounded-full flex items-center justify-center hover:bg-primary-light transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Links Rápidos</h4>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors scroll-smooth">Como Funciona</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors scroll-smooth">Preços</a></li>
              <li><a href="#testimonials" className="hover:text-primary transition-colors scroll-smooth">Histórias de Sucesso</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors scroll-smooth">FAQ</a></li>
              <li><Link to="/sobre-nos" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">Suporte</h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link to="/politica-de-privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos-de-servico" className="hover:text-primary transition-colors">Termos de Serviço</Link></li>
              <li><a href="#faq#refund-policy" className="hover:text-primary transition-colors scroll-smooth">Política de Reembolso</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Entre em Contato</h4>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>suporte@fitcoachpro.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+55 (11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>São Paulo, SP</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Horário de Atendimento</h5>
              <p className="text-gray-300 text-sm">
                Segunda - Sexta: 6h - 22h<br />
                Sábado - Domingo: 8h - 20h
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 FitCoach Pro. Todos os direitos reservados. Feito com ❤️ para sua jornada fitness.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/politica-de-privacidade" className="text-gray-400 hover:text-primary text-sm transition-colors">Privacidade</Link>
            <Link to="/termos-de-servico" className="text-gray-400 hover:text-primary text-sm transition-colors">Termos</Link>
            <a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}