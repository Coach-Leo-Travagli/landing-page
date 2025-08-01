import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "R$ 129",
    priceValue: 129.00,
    period: "/mês",
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
    price: "R$ 199",
    priceValue: 199.00,
    period: "/mês",
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
    price: "R$ 399", 
    priceValue: 399.00,
    period: "/mês",
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
          <p className="text-lg text-primary font-semibold mt-4">
            Assinatura mensal com cobrança automática
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-fitness-secondary text-white px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
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
                    variant={plan.variant === 'hero' ? 'default' : plan.variant === 'cta' ? 'default' : plan.variant}
                    size="lg"
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90 text-white' 
                        : plan.variant === 'cta' 
                          ? 'bg-fitness-secondary hover:bg-fitness-secondary/90 text-white'
                          : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {plan.popular ? 'Assinar Agora' : 'Assinar Plano'}
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Cancele sua assinatura a qualquer momento • 30 dias de garantia
          </p>
          <p className="text-sm text-muted-foreground">
            Cobrança automática mensal • Sem taxas ocultas • Suporte 24/7
          </p>
        </div>
      </div>
    </section>
  );
}