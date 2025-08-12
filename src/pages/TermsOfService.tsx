import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPhoneNumber } from "@/utils/phone";
import { getSupportEmail } from "@/utils/email";

export default function TermsOfService() {
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
            Termos de Serviço
          </h1>
          <p className="text-muted-foreground">
            Última atualização: Agosto de 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground mb-4">
              Ao acessar ou utilizar os serviços oferecidos pela Coach Travagli, você declara que leu, entendeu e concorda integralmente com estes Termos de Serviço. Caso não concorde com os termos, você deve se abster de utilizar nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">2. Descrição dos Serviços</h2>
            <p className="text-muted-foreground mb-4">
              A Coach Travagli oferece serviços de coaching fitness online, incluindo:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Planos de treino personalizados</li>
              <li>Orientação nutricional e planos de refeições (exclusivamente por profissional nutricionista registrado)</li>
              <li>Acompanhamento de progresso</li>
              <li>Suporte e consultoria online</li>
              <li>Acesso a conteúdo educacional e recursos</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              As orientações nutricionais e os planos alimentares são elaborados exclusivamente por nutricionista habilitado e registrado no Conselho Regional de Nutricionistas (CRN), contratado especificamente para esta finalidade.
            </p>
            <p className="text-muted-foreground mb-4">
              O Coach Travagli não realiza atendimentos nutricionais diretamente e não é responsável pela prescrição de dietas. O profissional de Educação Física atua dentro de sua competência legal, focando no desenvolvimento físico e orientação de treinos.
            </p>
            <p className="text-muted-foreground mb-4">
              Os serviços são oferecidos exclusivamente online e podem incluir atualizações, modificações ou acréscimos a critério da Coach Travagli.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">3. Responsabilidades do Usuário</h2>
            <p className="text-muted-foreground mb-4">
              Você se compromete a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Fornecer informações precisas e atualizadas</li>
              <li>Consultar um médico antes de iniciar qualquer programa de exercícios</li>
              <li>Usar os serviços de forma responsável e ética</li>
              <li>Não compartilhar seu acesso com terceiros</li>
              <li>Cumprir com todas as leis e regulamentos aplicáveis</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              Você entende que é o único responsável por suas decisões relacionadas à saúde e bem-estar, mesmo quando baseadas nas orientações fornecidas pelos nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">4. Pagamentos e Cancelamentos</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Pagamentos:</strong> Os pagamentos são processados no início de cada ciclo de cobrança. 
              Aceitamos os principais cartões de crédito e métodos de pagamento online. As assinaturas são renovadas automaticamente no final de cada ciclo, salvo cancelamento prévio pelo usuário.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Cancelamentos:</strong> Você pode cancelar sua assinatura a qualquer momento através da sua conta. 
              O cancelamento será efetivo no final do período de cobrança atual.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Reembolsos:</strong> Oferecemos garantia de 30 dias de devolução do dinheiro para novos clientes. A garantia de 30 dias é válida apenas para a primeira contratação do serviço por novos clientes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">5. Limitação de Responsabilidade</h2>
            <p className="text-muted-foreground mb-4">
              Nossos serviços são fornecidos "como estão". Não garantimos resultados específicos e não somos 
              responsáveis por lesões ou problemas de saúde decorrentes do uso de nossos programas. 
              Sempre consulte um profissional de saúde antes de iniciar qualquer programa de exercícios.
            </p>
            <p className="text-muted-foreground mb-4">
              As informações fornecidas não substituem aconselhamento médico, diagnóstico ou tratamento profissional. A Coach Travagli não se responsabiliza por quaisquer danos decorrentes da má utilização dos serviços ou da falta de acompanhamento médico adequado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">6. Propriedade Intelectual</h2>
            <p className="text-muted-foreground mb-4">
              Todo o conteúdo fornecido pela Coach Travagli, incluindo planos de treino, materiais educacionais 
              e recursos, são de nossa propriedade e protegidos por direitos autorais. O uso é licenciado 
              apenas para uso pessoal e não comercial.
            </p>
            <p className="text-muted-foreground mb-4">
              É proibida a reprodução, distribuição, modificação ou compartilhamento de qualquer conteúdo sem autorização expressa e por escrito da Coach Travagli.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">7. Alterações nos Termos</h2>
            <p className="text-muted-foreground mb-4">
              Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas 
              serão comunicadas com antecedência de 30 dias. O uso continuado dos serviços após as alterações 
              constitui aceitação dos novos termos.
            </p>
            <p className="text-muted-foreground mb-4">
              Recomendamos que o usuário revise periodicamente os Termos de Serviço para se manter informado sobre eventuais atualizações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-fitness-dark mb-4">8. Contato</h2>
            <p className="text-muted-foreground mb-4">
              Para questões sobre estes termos, entre em contato:
            </p>
            <p className="text-muted-foreground mb-4">
              Email: {getSupportEmail()}<br />
              Telefone: {formatPhoneNumber()}<br />
              Endereço: São Paulo, SP
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