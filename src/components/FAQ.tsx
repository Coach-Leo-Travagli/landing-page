import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How quickly will I see results?",
    answer: "Most clients see noticeable changes within 2-3 weeks, with significant transformations occurring within 8-12 weeks. Results vary based on starting point, consistency, and individual factors."
  },
  {
    question: "Do I need gym equipment?",
    answer: "Our plans are flexible! We can create home workouts with minimal equipment or full gym routines. During onboarding, we'll assess your available equipment and preferences."
  },
  {
    question: "What if I have dietary restrictions?",
    answer: "Absolutely no problem! Our nutrition plans accommodate all dietary restrictions including vegetarian, vegan, keto, gluten-free, and any food allergies. Just let us know during setup."
  },
  {
    question: "How much time do I need to commit daily?",
    answer: "Workouts typically range from 30-60 minutes, 4-6 times per week depending on your goals and availability. We work with your schedule to create a sustainable routine."
  },
  {
    question: "Can I switch plans if needed?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. We want to ensure you have the level of support that best fits your current needs and goals."
  },
  {
    question: "What if I'm not satisfied?",
    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your results or experience, we'll refund your payment, no questions asked."
  },
  {
    question: "Do you work with beginners?",
    answer: "Absolutely! Many of our most successful transformations come from complete beginners. Our trainers specialize in creating safe, progressive programs for all fitness levels."
  },
  {
    question: "How do the video calls work (VIP plan)?",
    answer: "VIP members get two 30-minute video calls per month with their dedicated trainer. These can be used for form checks, motivation, plan adjustments, or any questions you have."
  }
];

export default function FAQ() {
  return (
    <section className="py-20 bg-fitness-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-fitness-dark">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our fitness coaching program
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-fitness-card border-0 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-fitness-dark hover:text-primary hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a 
            href="mailto:support@fitnesscoach.com" 
            className="text-primary font-semibold hover:underline"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}