import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import CheckoutButton from "@/components/CheckoutButton";
import { getPlansForPricingComponent, type PlanType } from "@/utils/plans";
import { useEffect, useState } from "react";

const plans = getPlansForPricingComponent();

export default function Pricing() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setAnimate(true), 500); // Animation delay
            setTimeout(() => setAnimate(false), 1100); // Animation duration
          }
        });
      },
      { threshold: 0.3 }
    );

    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      observer.observe(pricingElement);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-white" id="pricing">
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
                animate ? 'scale-105' : ''
              } ${
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
                  
                  <CheckoutButton
                    planType={plan.planType}
                    variant={plan.variant}
                    size="lg"
                  >
                    {plan.popular ? 'Assinar Agora' : 'Assinar Plano'}
                  </CheckoutButton>
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