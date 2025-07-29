import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Em quanto tempo verei resultados?",
    answer: "A maioria dos clientes vê mudanças perceptíveis em 2-3 semanas, com transformações significativas ocorrendo em 8-12 semanas. Os resultados variam baseados no ponto de partida, consistência e fatores individuais."
  },
  {
    question: "Preciso de equipamentos de academia?",
    answer: "Nossos planos são flexíveis! Podemos criar treinos caseiros com equipamentos mínimos ou rotinas completas de academia. Durante o cadastro, avaliaremos seus equipamentos disponíveis e preferências."
  },
  {
    question: "E se eu tiver restrições alimentares?",
    answer: "Absolutamente sem problema! Nossos planos nutricionais acomodam todas as restrições alimentares incluindo vegetariana, vegana, keto, sem glúten e qualquer alergia alimentar. Apenas nos informe durante a configuração."
  },
  {
    question: "Quanto tempo preciso dedicar diariamente?",
    answer: "Os treinos variam tipicamente de 30-60 minutos, 4-6 vezes por semana dependendo dos seus objetivos e disponibilidade. Trabalhamos com sua agenda para criar uma rotina sustentável."
  },
  {
    question: "Posso trocar de plano se necessário?",
    answer: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Queremos garantir que você tenha o nível de suporte que melhor se adapta às suas necessidades e objetivos atuais."
  },
  {
    question: "E se eu não ficar satisfeito?",
    answer: "Oferecemos 30 dias de garantia de devolução do dinheiro. Se você não estiver completamente satisfeito com seus resultados ou experiência, reembolsaremos seu pagamento, sem perguntas."
  },
  {
    question: "Vocês trabalham com iniciantes?",
    answer: "Absolutamente! Muitas de nossas transformações mais bem-sucedidas vêm de iniciantes completos. Nossos personal trainers se especializam em criar programas seguros e progressivos para todos os níveis de condicionamento."
  },
  {
    question: "Como funcionam as videochamadas (plano VIP)?",
    answer: "Membros VIP recebem duas videochamadas de 30 minutos por mês com seu personal trainer dedicado. Podem ser usadas para verificação de forma, motivação, ajustes no plano ou qualquer dúvida que você tenha."
  }
];

export default function FAQ() {
  return (
    <section className="py-20 bg-fitness-light">
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