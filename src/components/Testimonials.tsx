import { Card, CardContent } from "@/components/ui/card";
import transformationImage from "@/assets/transformation.jpg";

const testimonials = [
  {
    name: "Sarah Johnson",
    age: 28,
    result: "Lost 35 lbs in 12 weeks",
    quote: "I never thought I could look this good! The personalized plan made all the difference. My trainer understood my busy schedule and created workouts I could actually stick to.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Mike Rodriguez", 
    age: 34,
    result: "Gained 20 lbs muscle",
    quote: "After years of inconsistent results, this program finally got me the physique I wanted. The nutrition guidance was a game-changer for my muscle building goals.",
    rating: 5,
    image: transformationImage
  },
  {
    name: "Emma Chen",
    age: 25, 
    result: "Transformed in 16 weeks",
    quote: "The weekly check-ins kept me accountable and motivated. Seeing my progress tracked professionally made such a huge difference in staying committed.",
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
            Real Results From Real People
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See the incredible transformations our clients have achieved
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
                    alt={`${testimonial.name} transformation`}
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
                  <div className="text-sm text-muted-foreground">Age {testimonial.age}</div>
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
              <div className="font-bold text-fitness-dark">5,000+ Success Stories</div>
              <div className="text-sm text-muted-foreground">Average 25lb weight loss in 12 weeks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}