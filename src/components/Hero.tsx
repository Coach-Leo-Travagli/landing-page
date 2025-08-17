import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-fitness-couple.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" role="banner" aria-labelledby="hero-title">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
        role="img"
        aria-label="Casal praticando exercícios físicos juntos - representando transformação fitness"
      >
        <div className="absolute inset-0 bg-fitness-dark/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="animate-fade-up">
          <h1 id="hero-title" className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Alcance Sua Melhor Versão
            <span className="block text-gradient">Com Personal Trainer Online</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Acompanhamento individualizado para você treinar bem, se alimentar melhor e ver resultados de verdade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12" role="group" aria-label="Ações principais">
            <Button 
              variant="hero" 
              size="xl" 
              className="min-w-[200px]"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Começar agora - ver planos e preços"
            >
              Começar Agora
            </Button>
            <Button 
              variant="outline-hero" 
              size="xl" 
              className="min-w-[200px]"
              onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Ver depoimentos de alunos transformados"
            >
              Ver Transformações
            </Button>
          </div>

          {/* Social Proof */}
          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-fitness-secondary border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-success border-2 border-white"></div>
              </div>
              <span>1000+ transformações realizadas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-fitness-secondary text-lg">⭐⭐⭐⭐⭐</span>
              <span>4.9/5 avaliação média</span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-label="Role para baixo para ver mais conteúdo">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center" role="img" aria-label="Indicador de rolagem">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}