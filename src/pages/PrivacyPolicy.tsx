import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-light mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-fitness-dark mb-4">
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground">
            Última atualização: Janeiro de 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">1. Informações que Coletamos</h2>
            <p className="text-muted-foreground mb-4">
              Coletamos informações que você nos fornece diretamente, como quando você se cadastra em nossos serviços, 
              preenche formulários, ou entra em contato conosco. Isso inclui:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Nome, email e informações de contato</li>
              <li>Dados de saúde e fitness quando fornecidos voluntariamente</li>
              <li>Preferências alimentares e objetivos de treino</li>
              <li>Informações de pagamento (processadas com segurança por terceiros)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">2. Como Usamos Suas Informações</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fornecer e personalizar nossos serviços de coaching</li>
              <li>Criar planos de treino e nutrição personalizados</li>
              <li>Comunicar sobre seu progresso e atualizações do serviço</li>
              <li>Melhorar nossos serviços e desenvolver novos recursos</li>
              <li>Processar pagamentos e gerenciar sua conta</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-muted-foreground mb-4">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Com seu consentimento explícito</li>
              <li>Para cumprir obrigações legais</li>
              <li>Com provedores de serviços que nos ajudam a operar nossa plataforma</li>
              <li>Para proteger nossos direitos e segurança</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">4. Segurança dos Dados</h2>
            <p className="text-muted-foreground mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais 
              contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">5. Seus Direitos</h2>
            <p className="text-muted-foreground mb-4">
              De acordo com a LGPD, você tem o direito de:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir dados incompletos ou imprecisos</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar seu consentimento a qualquer momento</li>
              <li>Portabilidade de dados</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">6. Contato</h2>
            <p className="text-muted-foreground mb-4">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
            </p>
            <p className="text-muted-foreground">
              Email: suporte@coachtravagli.com<br />
              Telefone: +55 (11) 99999-9999
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild variant="hero" size="lg">
            <Link to="/">Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}