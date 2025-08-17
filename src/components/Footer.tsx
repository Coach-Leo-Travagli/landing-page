import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { buildWhatsAppLink, formatPhoneNumber } from "@/utils/phone";
import { getSupportEmail } from "@/utils/email";
import logoTeamTravagli from "@/assets/logo_team_travagli.png";

export default function Footer() {
  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(getSupportEmail());
      toast.success('Email copiado para a área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar email');
    }
  };

  return (
    <footer className="bg-fitness-dark text-white py-16" role="contentinfo">
      <div className="container mx-auto px-4">
        {/* CTA Section */}
        <section className="text-center mb-16 py-12 px-4 bg-fitness-gradient rounded-2xl" aria-labelledby="footer-cta-title">
          <h2 id="footer-cta-title" className="text-3xl md:text-4xl font-black mb-4">
            Pronto Para Começar Sua Transformação?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Conte com orientação profissional de personal trainer online para evoluir no seu ritmo e alcançar seus objetivos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Ações para começar">
            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Ir para seção de preços e escolher plano"
            >
              Escolher Plano
            </Button>
            <Button 
              variant="outline-hero" 
              size="xl" 
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => window.open(buildWhatsAppLink('Oi, gostaria de saber mais sobre os planos de personal trainer online'), '_blank')}
              aria-label="Abrir WhatsApp para conversar sobre os planos"
            >
              Agendar Conversa
            </Button>
          </div>
        </section>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <section aria-labelledby="company-info">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logoTeamTravagli}
                alt="Logo do Team Travagli - Personal Trainer Online"
                className="h-8 w-auto object-contain"
                width="120"
                height="32"
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transformando vidas através de personal trainer online, coaching personalizado de fitness e nutrição. 
              Sua jornada para um você mais saudável e forte começa aqui.
            </p>
            <div className="flex space-x-4" role="list" aria-label="Redes sociais do Team Travagli">
              <a 
                href="https://www.instagram.com/leo.cazerta/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary !rounded-full flex items-center justify-center hover:bg-primary-light transition-colors"
                aria-label="Seguir Team Travagli no Instagram"
                role="listitem"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </section>

          {/* Quick Links */}
          <nav aria-labelledby="quick-links">
            <h4 id="quick-links" className="text-lg font-bold mb-6">Navegação</h4>
            <ul className="space-y-3 text-gray-300" role="list">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors scroll-smooth focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Ir para seção Como Funciona">Como Funciona</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors scroll-smooth focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Ir para seção de Preços">Preços</a></li>
              <li><a href="#testimonials" className="hover:text-primary transition-colors scroll-smooth focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Ir para Histórias de Transformação">Transformações</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors scroll-smooth focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Ir para Perguntas Frequentes">FAQ</a></li>
            </ul>
          </nav>

          {/* Support */}
          <nav aria-labelledby="support-links">
            <h4 id="support-links" className="text-lg font-bold mb-6">Informações Legais</h4>
            <ul className="space-y-3 text-gray-300" role="list">
              <li>
                <Link
                  to="/politica-de-privacidade"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  onClick={() => sessionStorage.setItem('fromFooterNav', '1')}
                  aria-label="Ler Política de Privacidade"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  to="/termos-de-servico"
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  onClick={() => sessionStorage.setItem('fromFooterNav', '1')}
                  aria-label="Ler Termos de Serviço"
                >
                  Termos de Serviço
                </Link>
              </li>
              <li><a href="#faq#refund-policy" className="hover:text-primary transition-colors scroll-smooth focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Ver Política de Reembolso">Política de Reembolso</a></li>
            </ul>
          </nav>

          {/* Contact Info */}
          <section aria-labelledby="contact-info">
            <h4 id="contact-info" className="text-lg font-bold mb-6">Entre em Contato</h4>
            <address className="space-y-4 text-gray-300 not-italic">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group max-w-full focus:outline-none focus:ring-2 focus:ring-primary rounded"
                onClick={handleEmailCopy}
                title="Clique para copiar o email"
                role="button"
                tabIndex={0}
                aria-label={`Email de contato: ${getSupportEmail()}. Clique para copiar`}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailCopy()}
              >
                <Mail className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="truncate text-sm sm:text-base">{getSupportEmail()}</span>
              </div>
              <div className="flex items-center gap-3 max-w-full cursor-pointer hover:text-primary transition-colors group focus:outline-none focus:ring-2 focus:ring-primary rounded"
                onClick={() => window.open(buildWhatsAppLink('Oi, gostaria de saber mais sobre personal trainer online'), '_blank')}
                title="Entre em contato pelo WhatsApp"
                role="button"
                tabIndex={0}
                aria-label={`WhatsApp: ${formatPhoneNumber()}. Clique para abrir conversa`}
                onKeyDown={(e) => e.key === 'Enter' && window.open(buildWhatsAppLink('Oi, gostaria de saber mais sobre personal trainer online'), '_blank')}
              >
                <Phone className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="truncate text-sm sm:text-base">{formatPhoneNumber()}</span>
              </div>
              <div className="flex items-center gap-3 max-w-full">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="truncate text-sm sm:text-base">Bauru, SP - Brasil</span>
              </div>
            </address>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Horário de Atendimento</h5>
              <time className="text-gray-300 text-sm">
                Segunda - Sexta: 8h - 18h (Horário de Brasília)
              </time>
            </div>
          </section>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Team Travagli. Todos os direitos reservados. Feito com ❤️ para sua jornada fitness.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/politica-de-privacidade"
              className="text-gray-400 hover:text-primary text-sm transition-colors"
              onClick={() => sessionStorage.setItem('fromFooterNav', '1')}
            >
              Privacidade
            </Link>
            <Link
              to="/termos-de-servico"
              className="text-gray-400 hover:text-primary text-sm transition-colors"
              onClick={() => sessionStorage.setItem('fromFooterNav', '1')}
            >
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}