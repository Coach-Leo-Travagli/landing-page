import { Card, CardContent } from "@/components/ui/card";
import transformationImage from "@/assets/transformation.jpg";

const testimonials = [
  {
    name: "Ana Silva",
    age: 28,
    result: "Perdeu 16kg em 12 semanas",
    quote: "Nunca pensei que poderia ficar assim! O plano personalizado fez toda a diferença. Meu personal entendeu minha rotina corrida e criou treinos que eu conseguia seguir.",
    rating: 5,
    image: transformationImage
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
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-testimonial-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-fitness-dark">
            Resultados Reais de Pessoas Reais
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Veja as transformações incríveis que nossos clientes alcançaram
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-fitness-card hover:shadow-lg transition-all duration-300 border-0 bg-white">
              <CardContent className="p-8">
                {/* Before/After Image */}
                <div className="mb-6 relative overflow-hidden rounded-lg">
                  <img 
                    src={testimonial.image} 
                    alt={`Transformação de ${testimonial.name}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                    {testimonial.result}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-fitness-secondary text-lg">⭐</span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="border-t pt-4">
                  <div className="font-bold text-fitness-dark">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.age} anos</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-fitness-card">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-primary border-2 border-white"></div>
              ))}
            </div>
            <div className="text-left">
              <div className="font-bold text-fitness-dark">5.000+ Histórias de Sucesso</div>
              <div className="text-sm text-muted-foreground">Perda média de 11kg em 12 semanas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}