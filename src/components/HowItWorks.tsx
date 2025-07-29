import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Sign Up & Assessment",
    description: "Complete our comprehensive fitness assessment and tell us your goals. We analyze your lifestyle, preferences, and limitations.",
    icon: "👤"
  },
  {
    number: "02", 
    title: "Get Your Personalized Plan",
    description: "Receive a custom workout and nutrition plan designed specifically for your body type, goals, and schedule.",
    icon: "📋"
  },
  {
    number: "03",
    title: "Weekly Check-ins & Support", 
    description: "Track progress with weekly follow-ups, plan adjustments, and 24/7 support from our certified trainers.",
    icon: "📈"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-fitness-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-fitness-dark">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our proven 3-step process has helped thousands achieve their fitness goals
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