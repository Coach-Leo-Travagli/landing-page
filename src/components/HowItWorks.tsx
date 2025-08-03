import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Cadastro e Avaliação",
    // description: "Preencha nossa avaliação física online contando seus objetivos, estilo de vida e possíveis limitações.",
    description: "Preencha nosso questionário para entendermos seu histórico, rotina e objetivos. Essa avaliação é a base para um plano que se adapta ao seu perfil.",
    icon: "👤"
  },
  {
    number: "02", 
    title: "Plano Personalizado",
    // description: "Receba um plano exclusivo de treino e nutrição, desenvolvido de forma individual para atender suas necessidades e rotina.",
    description: "Com base na avaliação, criamos um plano exclusivo de treino e nutrição, ajustado ao seu nível atual e metas desejadas.",
    icon: "📋"
  },
  {
    number: "03",
    title: "Acompanhamento Semanal", 
    // description: "Acompanhe seu progresso com revisões semanais e suporte direto do personal trainer para ajustes no plano sempre que necessário.",
    description: "Você terá acompanhamento semanal para avaliar o progresso e fazer ajustes necessários, além de suporte direto para tirar dúvidas ao longo do processo.",
    icon: "📈"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-fitness-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-fitness-dark">
            Como Funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {/* Veja como funciona o acompanhamento para você alcançar seus objetivos com segurança e personalização. */}
            Nosso processo simples em 3 etapas foi pensado para facilitar sua jornada de transformação, do cadastro ao acompanhamento contínuo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full shadow-fitness-card hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <div className="text-5xl font-black text-primary mb-4">{step.number}</div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 text-fitness-dark leading-tight">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                    →
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}