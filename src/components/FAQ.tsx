import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { buildWhatsAppLink } from "@/utils/phone";

const faqs = [
  {
    id: "promotional-pricing",
    question: "O desconto promocional vale apenas no primeiro mês?",
    answer: "Não! O valor promocional é travado para toda a duração da sua assinatura. Enquanto você mantiver o plano ativo, pagará sempre o mesmo valor promocional, sem aumentos."
  },
  {
    id: "price-lock-policy",
    question: "O que acontece se eu tiver desconto promocional e cancelar e reassinar depois?",
    answer: "Se você cancelar, perderá o desconto promocional. Ao reassinar, pagará o valor vigente no momento da nova contratação. Por isso, recomendamos manter a assinatura ativa para preservar o desconto."
  },
  {
    id: "price-increases",
    question: "Os preços podem aumentar durante minha assinatura?",
    answer: "Para assinantes ativos, mantemos o valor travado. Aumentos de preço se aplicam apenas a novos assinantes. Seu preço permanece o mesmo enquanto você mantiver a assinatura ativa."
  },
  {
    id: "refund-policy",
    question: "E se eu não ficar satisfeito?",
    answer: "Oferecemos uma garantia de 30 dias. Caso não esteja satisfeito com o serviço nesse período, devolvemos o valor pago sem burocracia."
  },
  {
    id: "results-timeline",
    question: "Em quanto tempo verei resultados?",
    answer: "Isso varia de pessoa para pessoa. Algumas mudanças sutis podem ser percebidas já nas primeiras semanas, mas resultados consistentes costumam aparecer após 8 a 12 semanas de dedicação ao plano."
  },
  {
    id: "gym-equipment",
    question: "Preciso de equipamentos de academia?",
    answer: "Não necessariamente. Podemos criar treinos que funcionam em casa com equipamentos básicos ou montar uma rotina completa para academia, dependendo da sua preferência e recursos disponíveis."
  },
  {
    id: "dietary-restrictions",
    question: "E se eu tiver restrições alimentares?",
    answer: "Sem problema. O nutricionista parceiro leva em consideração alergias, intolerâncias e preferências alimentares, como dieta vegetariana, vegana, sem glúten, entre outras, para elaborar seu plano alimentar personalizado."
  },
  {
    id: "daily-time-commitment",
    question: "Quanto tempo preciso dedicar diariamente?",
    answer: "A maioria dos treinos dura entre 30 e 60 minutos, de 4 a 6 vezes por semana. Ajustamos o programa de acordo com o seu tempo e disponibilidade para que seja sustentável a longo prazo."
  },
  {
    id: "plan-changes",
    question: "Posso trocar de plano se necessário?",
    answer: "Sim, você pode mudar para outro plano a qualquer momento, seja para obter mais suporte ou simplificar o acompanhamento. Basta entrar em contato com a nossa equipe."
  },
  {
    id: "nutrition-responsibility",
    question: "Quem é responsável pelos planos alimentares?",
    answer: "Todos os planos alimentares oferecidos na plataforma são elaborados e assinados exclusivamente por nutricionistas devidamente registrados nos conselhos profissionais. O Coach Travagli atua apenas como treinador físico e não prescreve dietas ou orientações nutricionais sem a supervisão de um nutricionista."
  },
  {
    id: "beginners-welcome",
    question: "Vocês trabalham com iniciantes?",
    answer: "Sim, muitos de nossos clientes estão começando do zero. O acompanhamento é pensado para cada nível de experiência, sempre com foco em evolução segura e gradual."
  },
  {
    id: "video-calls-vip",
    question: "Como funcionam as videochamadas (plano VIP)?",
    answer: "Clientes do plano VIP têm direito a duas videochamadas mensais de 30 minutos com o treinador. Nessas sessões, você pode tirar dúvidas, revisar exercícios e ajustar seu plano."
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
            Tudo que você precisa saber sobre nosso programa de treino e nutrição
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
            onClick={() => window.open(buildWhatsAppLink('Oi'), '_blank')}
            className="text-primary font-semibold hover:underline hover:cursor-pointer"
          >
            Entre em contato com nossa equipe de suporte
          </a>
        </div>
      </div>
    </section>
  );
}