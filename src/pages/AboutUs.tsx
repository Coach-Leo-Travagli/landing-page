import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logoTeamTravagli from "@/assets/logo_team_travagli.png";

const teamMembers = [
  {
    name: "Dr. Carlos Silva",
    role: "Fundador e Coach Principal",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face",
    description: "Especialista em transformação corporal com mais de 15 anos de experiência. PhD em Ciências do Esporte."
  },
  {
    name: "Ana Beatriz Santos",
    role: "Nutricionista Chefe",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    description: "Mestre em Nutrição Esportiva, especializada em planos alimentares personalizados para atletas e fitness."
  },
  {
    name: "Roberto Oliveira",
    role: "Coach de Performance",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    description: "Ex-atleta profissional, focado em treinos de alta performance e preparação física avançada."
  },
  {
    name: "Mariana Costa",
    role: "Coach de Bem-Estar",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    description: "Especialista em saúde mental e bem-estar, ajuda clientes a manter motivação e equilíbrio na jornada fitness."
  }
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-fitness-dark text-white py-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Início
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={logoTeamTravagli}
              alt="Team Travagli"
              className="h-16 w-auto object-contain"
            />
            <h1 className="text-4xl md:text-5xl font-black">Sobre Nós</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Conheça a equipe por trás das milhares de transformações que mudaram vidas em todo o Brasil.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-8">Nossa Missão</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Na Team Travagli, acreditamos que cada pessoa merece viver sua melhor versão. Nossa missão é 
              democratizar o acesso a coaching de fitness personalizado e de alta qualidade, oferecendo 
              planos sob medida que respeitam as necessidades, limitações e objetivos únicos de cada cliente.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Combinamos ciência, tecnologia e experiência humana para criar uma jornada de transformação 
              sustentável, onde cada conquista é celebrada e cada desafio é superado com suporte especializado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-black text-white">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Personalização Total</h3>
                <p className="text-muted-foreground">
                  Cada plano é único, criado especificamente para suas necessidades, objetivos e estilo de vida.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-black text-white">🔬</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Base Científica</h3>
                <p className="text-muted-foreground">
                  Nossos métodos são fundamentados nas mais recentes pesquisas em ciências do esporte e nutrição.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-black text-white">❤️</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Suporte Humano</h3>
                <p className="text-muted-foreground">
                  Nossa equipe está sempre ao seu lado, oferecendo motivação e ajustes quando necessário.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-fitness-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-8">Nossa Equipe</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Profissionais altamente qualificados e apaixonados por transformar vidas através do fitness e nutrição.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-semibold mb-4">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-8">Nossos Resultados</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Números que falam por si só sobre o impacto que temos na vida das pessoas.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">5.000+</div>
              <p className="text-muted-foreground">Transformações Concluídas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">98%</div>
              <p className="text-muted-foreground">Taxa de Satisfação</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">-15kg</div>
              <p className="text-muted-foreground">Média de Perda de Peso</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-primary mb-2">90</div>
              <p className="text-muted-foreground">Dias Médios de Transformação</p>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/">
                Comece Sua Transformação Agora
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}