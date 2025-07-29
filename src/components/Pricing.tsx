import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$49",
    period: "/month",
    description: "Perfect for beginners starting their fitness journey",
    features: [
      "Personalized workout plans",
      "Exercise video library",
      "Progress tracking",
      "Basic nutrition guidelines",
      "Email support"
    ],
    popular: false,
    variant: "outline" as const
  },
  {
    name: "Standard", 
    price: "$99",
    period: "/month",
    description: "Most popular choice for serious transformations",
    features: [
      "Everything in Basic",
      "Custom nutrition meal plans",
      "Supplement recommendations",
      "Weekly progress check-ins",
      "Priority chat support",
      "Recipe database access"
    ],
    popular: true,
    variant: "hero" as const
  },
  {
    name: "VIP",
    price: "$199", 
    period: "/month",
    description: "Premium coaching with maximum results",
    features: [
      "Everything in Standard",
      "1-on-1 video calls (2x/month)",
      "24/7 trainer support",
      "Meal prep planning",
      "Body composition analysis",
      "Priority plan adjustments",
      "Exclusive community access"
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
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect coaching package for your fitness goals and budget
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-fitness-secondary text-white px-6 py-2 rounded-full text-sm font-bold">
                    MOST POPULAR
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
                    {plan.popular ? 'Start Now' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include a 30-day money-back guarantee
          </p>
          <p className="text-sm text-muted-foreground">
            Cancel anytime • No hidden fees • Secure payment
          </p>
        </div>
      </div>
    </section>
  );
}