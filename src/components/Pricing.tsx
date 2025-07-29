import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "$49",
    period: " USD/mês",
    description: "Perfeito para iniciantes que estão começando sua jornada fitness",
    features: [
      "Planos de treino personalizados",
      "Biblioteca de vídeos de exercícios",
      "Acompanhamento de progresso",
      "Diretrizes básicas de nutrição",
      "Suporte por email"
    ],
    popular: false,
    variant: "outline" as const
  },
  {
    name: "Padrão", 
    price: "$99",
    period: " USD/mês",
    description: "Escolha mais popular para transformações sérias",
    features: [
      "Tudo do plano Básico",
      "Planos de refeições personalizados",
      "Recomendações de suplementos",
      "Check-ins semanais de progresso",
      "Suporte prioritário por chat",
      "Acesso ao banco de receitas"
    ],
    popular: true,
    variant: "hero" as const
  },
  {
    name: "VIP",
    price: "$199", 
    period: " USD/mês",
    description: "Coaching premium com resultados máximos",
    features: [
      "Tudo do plano Padrão",
      "Videochamadas 1-a-1 (2x/mês)",
      "Suporte 24/7 do personal trainer",
      "Planejamento de meal prep",
      "Análise de composição corporal",
      "Ajustes prioritários no plano",
      "Acesso à comunidade exclusiva"
    ],
    popular: false,
    variant: "cta" as const
  }
];

export default function Pricing() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-fitness-dark">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Selecione o pacote de coaching perfeito para seus objetivos fitness e orçamento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-fitness-secondary text-white px-6 py-2 rounded-full text-sm font-bold">
                    MAIS POPULAR
                  </span>
                </div>
              )}
              
              <Card className={`h-full transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'shadow-fitness-hero border-primary border-2' 
                  : 'shadow-fitness-card hover:shadow-lg border-0'
              }`}>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-fitness-dark mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-black text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.variant} 
                    size="lg" 
                    className="w-full"
                  >
                    {plan.popular ? 'Comece Agora' : 'Começar'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Todos os planos incluem 30 dias de garantia de devolução do dinheiro
          </p>
          <p className="text-sm text-muted-foreground">
            Cancele a qualquer momento • Sem taxas ocultas • Pagamento seguro
          </p>
        </div>
      </div>
    </section>
  );
}