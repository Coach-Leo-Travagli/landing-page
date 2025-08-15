import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getSupportEmail } from "@/utils/email";
import { formatPhoneNumber } from "@/utils/phone";
import logoTeamTravagli from "@/assets/logo_team_travagli.png";

export default function PrivacyPolicy() {
  // Always scroll to top immediately on mount
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-light mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={logoTeamTravagli}
              alt="Team Travagli"
              className="h-12 w-auto object-contain"
            />
            <h1 className="text-4xl md:text-5xl font-black text-fitness-dark">
              Política de Privacidade
            </h1>
          </div>
          <p className="text-muted-foreground">
            Última atualização: Agosto de 2025
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
              <li>Dados de saúde e fitness (como peso, hábitos alimentares e restrições médicas), quando fornecidos voluntariamente, tratados com base no seu consentimento</li>
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
              <li>Criar planos de treino (pelo treinador) e planos de nutrição personalizados (exclusivamente por profissional nutricionista registrado)</li>
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
              <li>Com profissionais autorizados (como nutricionistas parceiros), que seguem esta Política e a legislação de proteção de dados</li>
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
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">6. Dados Sensíveis e Responsabilidade Profissional</h2>
            <p className="text-muted-foreground mb-4">
              Os planos de treino são desenvolvidos pelo Coach Travagli (profissional de educação física), enquanto os planos alimentares e nutricionais são elaborados exclusivamente por nutricionistas devidamente registrados.
            </p>
            <p className="text-muted-foreground">
              Garantimos que qualquer informação sensível fornecida por você será compartilhada apenas com profissionais autorizados, conforme exigido pela legislação aplicável.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">7. Contato</h2>
            <p className="text-muted-foreground mb-4">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
            </p>
            <p className="text-muted-foreground mb-4">
              Email: {getSupportEmail()}<br />
              Telefone: {formatPhoneNumber()}<br />
              Endereço: Bauru, SP
            </p>
            <p className="text-muted-foreground mb-4">
              Nosso horário de atendimento é de segunda a sexta, das 8h às 18h (horário de Brasília).
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