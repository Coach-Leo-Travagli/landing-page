import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Cadastro e Avaliação",
    description: "Complete nossa avaliação física abrangente e nos conte seus objetivos. Analisamos seu estilo de vida, preferências e limitações.",
    icon: "👤"
  },
  {
    number: "02", 
    title: "Receba Seu Plano Personalizado",
    description: "Receba um plano personalizado de treino e nutrição desenvolvido especificamente para seu tipo físico, objetivos e rotina.",
    icon: "📋"
  },
  {
    number: "03",
    title: "Acompanhamento e Suporte Semanal", 
    description: "Monitore o progresso com acompanhamentos semanais, ajustes no plano e suporte 24/7 de nossos personal trainers certificados.",
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
            Nosso processo comprovado de 3 etapas já ajudou milhares a alcançar seus objetivos fitness
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full shadow-fitness-card hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <div className="text-5xl font-black text-primary mb-4">{step.number}</div>
                  <h3 className="text-2xl font-bold mb-4 text-fitness-dark">{step.title}</h3>
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