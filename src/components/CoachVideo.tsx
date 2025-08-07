import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const CoachVideo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-20 bg-fitness-light transition-all duration-700 ${
        isVisible ? "animate-fade-up opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-fitness-dark mb-4">
            Conheça o Coach Travagli
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Assista ao vídeo para conhecer melhor o Coach Travagli e entender como funciona nosso programa de transformação.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="fitness-shadow rounded-2xl overflow-hidden bg-white">
            <AspectRatio ratio={16 / 9}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=example"
                title="Conheça o Coach Travagli"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachVideo;