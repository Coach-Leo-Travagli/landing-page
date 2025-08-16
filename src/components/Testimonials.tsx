import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import transformationImage from "@/assets/transformation.jpg";
import resultadoHelder from "@/assets/resultado_helder.jpg";

const testimonials = [
  {
    name: "Helder Traci",
    age: 32,
    result: "Perca de peso e ganho de massa muscular",
    quote: "Com a ajuda do personal trainer, conquistei resultados incríveis que nunca tive antes. Eu recomendo a todos que querem perder peso e melhorar a qualidade de vida.",
    rating: 5,
    image: resultadoHelder
  },
  {
    name: "Carlos Santos", 
    age: 34,
    result: "Ganhou 9kg de massa muscular",
    quote: "Após anos de resultados inconsistentes, esse programa finalmente me deu o físico que eu queria. A orientação nutricional mudou tudo para meus objetivos de ganho de massa.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Mariana Costa",
    age: 25, 
    result: "Transformação em 16 semanas",
    quote: "Os check-ins semanais me mantiveram responsável e motivada. Ver meu progresso acompanhado profissionalmente fez uma diferença enorme para me manter comprometida.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Rafael Silva",
    age: 28,
    result: "Perdeu 18kg em 5 meses",
    quote: "Nunca imaginei que conseguiria emagrecer de forma tão saudável. O acompanhamento nutricional foi fundamental para manter a disciplina e ver resultados reais.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Ana Paula",
    age: 31,
    result: "Transformação completa",
    quote: "Além da mudança física, minha autoestima aumentou muito. O personal soube exatamente como me motivar nos momentos mais difíceis do processo.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "João Pedro",
    age: 26,
    result: "Definição muscular em 12 semanas",
    quote: "O treino personalizado fez toda a diferença. Em pouco tempo já estava vendo a definição que sempre quis, seguindo um plano que funcionou perfeitamente pra mim.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Fernanda Lima",
    age: 29,
    result: "Ganhou força e resistência",
    quote: "Hoje consigo fazer exercícios que antes eram impossíveis. A evolução da minha força física mudou completamente minha relação com o exercício.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Bruno Santos",
    age: 35,
    result: "Perdeu 25kg e ganhou saúde",
    quote: "Não foi só uma mudança estética, foi uma mudança de vida completa. Minha pressão normalizou e me sinto 10 anos mais jovem.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Juliana Oliveira",
    age: 27,
    result: "Corpo dos sonhos em 6 meses",
    quote: "Sempre tive dificuldade para emagrecer, mas com o acompanhamento profissional consegui resultados que nunca havia alcançado antes.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Diego Ferreira",
    age: 30,
    result: "Hipertrofia e definição",
    quote: "O programa de hipertrofia superou todas as minhas expectativas. Ganhei massa magra e defini o corpo seguindo exatamente as orientações.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Camila Rodrigues",
    age: 24,
    result: "Perdeu 12kg em 3 meses",
    quote: "O que mais me impressionou foi a rapidez dos resultados mantendo a saúde. Emagreci sem passar fome e sem perder energia para o dia a dia.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Lucas Martins",
    age: 33,
    result: "Transformação aos 30+",
    quote: "Provei que idade não é desculpa. Aos 33 consegui o melhor shape da minha vida com dedicação e o acompanhamento certo.",
    rating: 5,
    image: transformationImage
  }
];

export default function Testimonials() {
  const [isPaused, setIsPaused] = React.useState(false);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section className="py-20 bg-white">
      {/* Header centralizado com container */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-fitness-dark">
            Histórias de Alunos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça pessoas que já tiveram evolução com nosso acompanhamento
          </p>
        </div>
      </div>

      {/* Marquee full width sem container */}
      <div className="relative overflow-hidden w-full">
          {/* Marquee Container */}
          <div 
            className={`flex gap-6 w-max marquee-responsive ${isPaused ? 'animation-paused' : ''} mb-4`}
            style={{
              paddingLeft: '50vw',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleMouseEnter}
            onTouchEnd={handleMouseLeave}
          >
            {/* Primeiro conjunto de testimonials */}
            {testimonials.map((testimonial, index) => (
              <div key={`first-${index}`} className="w-80 flex-shrink-0">
                <Card className="shadow-fitness-card hover:shadow-lg transition-all duration-300 border-0 bg-testimonial-gradient h-full">
                  <CardContent className="p-8 flex flex-col h-full">
                    {/* Before/After Image */}
                    <div className="mb-6 relative overflow-hidden rounded-lg">
                      <img 
                        src={testimonial.image} 
                        alt={`Transformação de ${testimonial.name}`}
                        className="w-full h-auto max-h-48 object-cover object-top"
                      />
                      <div className="absolute bottom-2 left-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                        {testimonial.result}
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-muted-foreground mb-6 italic leading-relaxed flex-1">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Author */}
                    <div className="border-t pt-4 mt-auto">
                      <div className="font-bold text-fitness-dark">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.age} anos</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {/* Segundo conjunto para loop infinito */}
            {testimonials.map((testimonial, index) => (
              <div key={`second-${index}`} className="w-80 flex-shrink-0">
                <Card className="shadow-fitness-card hover:shadow-lg transition-all duration-300 border-0 bg-testimonial-gradient h-full">
                  <CardContent className="p-8 flex flex-col h-full">
                    {/* Before/After Image */}
                    <div className="mb-6 relative overflow-hidden rounded-lg">
                      <img 
                        src={testimonial.image} 
                        alt={`Transformação de ${testimonial.name}`}
                        className="w-full h-auto max-h-48 object-cover object-top"
                      />
                      <div className="absolute bottom-2 left-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                        {testimonial.result}
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-muted-foreground mb-6 italic leading-relaxed flex-1">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Author */}
                    <div className="border-t pt-4 mt-auto">
                      <div className="font-bold text-fitness-dark">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.age} anos</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
        {/* Gradient overlays para um efeito mais suave nas bordas */}
        <div className="absolute top-0 left-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-8 sm:w-12 md:w-16 lg:w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
      </div>
    </section>
  );
}