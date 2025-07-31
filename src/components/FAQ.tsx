import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";

const faqs = [
  {
    id: "results-timeline",
    question: "Em quanto tempo verei resultados?",
    answer: "A maioria dos clientes vê mudanças perceptíveis em 2-3 semanas, com transformações significativas ocorrendo em 8-12 semanas. Os resultados variam baseados no ponto de partida, consistência e fatores individuais."
  },
  {
    id: "gym-equipment",
    question: "Preciso de equipamentos de academia?",
    answer: "Nossos planos são flexíveis! Podemos criar treinos caseiros com equipamentos mínimos ou rotinas completas de academia. Durante o cadastro, avaliaremos seus equipamentos disponíveis e preferências."
  },
  {
    id: "dietary-restrictions",
    question: "E se eu tiver restrições alimentares?",
    answer: "Absolutamente sem problema! Nossos planos nutricionais acomodam todas as restrições alimentares incluindo vegetariana, vegana, keto, sem glúten e qualquer alergia alimentar. Apenas nos informe durante a configuração."
  },
  {
    id: "daily-time-commitment",
    question: "Quanto tempo preciso dedicar diariamente?",
    answer: "Os treinos variam tipicamente de 30-60 minutos, 4-6 vezes por semana dependendo dos seus objetivos e disponibilidade. Trabalhamos com sua agenda para criar uma rotina sustentável."
  },
  {
    id: "plan-changes",
    question: "Posso trocar de plano se necessário?",
    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Queremos garantir que você tenha o nível de suporte que melhor se adapta às suas necessidades e objetivos atuais."
  },
  {
    id: "refund-policy",
    question: "E se eu não ficar satisfeito?",
    answer: "Oferecemos 30 dias de garantia de devolução do dinheiro. Se você não estiver completamente satisfeito com seus resultados ou experiência, reembolsaremos seu pagamento, sem perguntas."
  },
  {
    id: "beginners-welcome",
    question: "Vocês trabalham com iniciantes?",
    answer: "Absolutamente! Muitas de nossas transformações mais bem-sucedidas vêm de iniciantes completos. Nossos personal trainers se especializam em criar programas seguros e progressivos para todos os níveis de condicionamento."
  },
  {
    id: "video-calls-vip",
    question: "Como funcionam as videochamadas (plano VIP)?",
    answer: "Membros VIP recebem duas videochamadas de 30 minutos por mês com seu personal trainer dedicado. Podem ser usadas para verificação de forma, motivação, ajustes no plano ou qualquer dúvida que você tenha."
  }
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | undefined>();
  const [highlightRefundPolicy, setHighlightRefundPolicy] = useState<boolean>(false);

  useEffect(() => {
    // Check if we need to auto-expand the refund policy question and scroll to FAQ
    const checkForRefundExpansion = () => {
      const hash = window.location.hash;
      if (hash === '#faq#refund-policy') {
        // Find the refund policy question
        const refundFaq = faqs.find(faq => faq.id === "refund-policy");
        if (refundFaq) {
          setOpenItem("refund-policy");
          
          // Scroll to the FAQ section
          setTimeout(() => {
            const faqSection = document.getElementById('faq-section');
            if (faqSection) {
              faqSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
              
              // Trigger highlight animation after scrolling
              setTimeout(() => {
                setHighlightRefundPolicy(true);
                // Remove highlight after animation completes
                setTimeout(() => setHighlightRefundPolicy(false), 1000);
              }, 500); // Wait for scroll to complete
            }
          }, 100); // Small delay to ensure the accordion item is expanded
          
          // Clear the hash after expanding and scrolling
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    // Check immediately and also when hash changes
    checkForRefundExpansion();
    window.addEventListener('hashchange', checkForRefundExpansion);
    
    return () => window.removeEventListener('hashchange', checkForRefundExpansion);
  }, []);

  return (
    <section id="faq-section" className="py-20 bg-fitness-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-fitness-dark">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa saber sobre nosso programa de coaching fitness
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion 
            type="single" 
            collapsible 
            className="space-y-4"
            value={openItem}
            onValueChange={setOpenItem}
          >
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index}
                id={faq.id}
                value={faq.id}
                className={`bg-white rounded-lg shadow-fitness-card border-0 px-6 transition-all duration-1000 ${
                  faq.id === 'refund-policy' && highlightRefundPolicy 
                    ? 'animate-pulse ring-4 ring-primary ring-opacity-50 shadow-lg transform scale-[1.02]' 
                    : ''
                }`}
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
            Ainda tem dúvidas?
          </p>
          <a 
            href="mailto:suporte@fitnesscoach.com" 
            className="text-primary font-semibold hover:underline"
          >
            Entre em contato com nossa equipe de suporte
          </a>
        </div>
      </div>
    </section>
  );
}