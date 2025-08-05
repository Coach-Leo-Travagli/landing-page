import { useState } from "react";
import { Copy, Check } from "lucide-react";

const Email = () => {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const copyToClipboard = (html: string, templateName: string) => {
    navigator.clipboard.writeText(html);
    setCopiedTemplate(templateName);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const welcomeEmailHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo(a) à sua transformação fitness!</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: hsl(220, 15%, 97%); }
        .container { max-width: 600px; margin: 0 auto; background-color: hsl(0, 0%, 100%); }
        .header { background: linear-gradient(135deg, hsl(213, 94%, 59%), hsl(217, 91%, 68%)); padding: 40px 20px; text-align: center; }
        .logo { max-width: 200px; height: auto; }
        .content { padding: 40px 30px; color: hsl(220, 20%, 15%); line-height: 1.6; }
        .greeting { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: hsl(213, 94%, 59%); }
        .message { font-size: 16px; margin-bottom: 25px; }
        .benefits { background-color: hsl(220, 15%, 97%); padding: 25px; border-radius: 12px; margin: 30px 0; }
        .benefit-item { display: flex; align-items: center; margin: 12px 0; font-size: 15px; }
        .check-icon { color: hsl(142, 76%, 36%); margin-right: 10px; font-weight: bold; }
        .cta-container { text-align: center; margin: 35px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, hsl(213, 94%, 59%), hsl(217, 91%, 68%)); color: hsl(0, 0%, 100%); padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; }
        .cta-button:hover { transform: translateY(-2px); box-shadow: 0 8px 25px hsla(213, 94%, 59%, 0.3); }
        .footer { background-color: hsl(220, 15%, 97%); padding: 30px 20px; text-align: center; color: hsl(220, 8%, 46%); font-size: 14px; }
        .footer a { color: hsl(213, 94%, 59%); text-decoration: none; }
        @media only screen and (max-width: 600px) {
            .content { padding: 30px 20px; }
            .greeting { font-size: 20px; }
            .cta-button { padding: 14px 28px; font-size: 15px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{companyLogoUrl}}" alt="Logo" class="logo">
        </div>
        
        <div class="content">
            <div class="greeting">Olá {{customerName}}! 🎉</div>
            
            <div class="message">
                Obrigado por se juntar a nós! 🧡 Sua assinatura foi confirmada com sucesso e estamos muito animados para ajudar você a alcançar seus objetivos de saúde e condicionamento físico.
            </div>
            
            <div class="benefits">
                <div style="font-weight: 600; margin-bottom: 15px; color: hsl(213, 94%, 59%);">Em breve, você receberá:</div>
                <div class="benefit-item">
                    <span class="check-icon">✅</span>
                    Planos de treino personalizados
                </div>
                <div class="benefit-item">
                    <span class="check-icon">✅</span>
                    Orientação nutricional exclusiva
                </div>
                <div class="benefit-item">
                    <span class="check-icon">✅</span>
                    Acesso ao seu personal trainer dedicado
                </div>
            </div>
            
            <div class="message">
                Clique no botão abaixo para acessar sua conta e começar sua jornada:
            </div>
            
            <div class="cta-container">
                <a href="#" class="cta-button">Acessar Minha Conta</a>
            </div>
            
            <div class="message">
                Caso tenha qualquer dúvida, nossa equipe está à disposição para ajudar – basta responder este email ou entrar em contato pelo suporte.
            </div>
            
            <div class="message">
                Vamos juntos nessa jornada para uma versão mais saudável e forte de você! 💪
            </div>
            
            <div style="margin-top: 30px; font-weight: 600;">
                Abraços,<br>
                Equipe {{companyName}}
            </div>
        </div>
        
        <div class="footer">
            <div>
                Precisa de ajuda? Entre em contato: <a href="mailto:suporte@{{companyName}}.com">suporte@{{companyName}}.com</a>
            </div>
            <div style="margin-top: 15px;">
                <a href="#">Cancelar inscrição</a> | <a href="#">Política de Privacidade</a>
            </div>
        </div>
    </div>
</body>
</html>`;

  const paymentFailedEmailHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Houve um problema com seu pagamento</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: hsl(220, 15%, 97%); }
        .container { max-width: 600px; margin: 0 auto; background-color: hsl(0, 0%, 100%); }
        .header { background: linear-gradient(135deg, hsl(213, 94%, 59%), hsl(217, 91%, 68%)); padding: 40px 20px; text-align: center; }
        .logo { max-width: 200px; height: auto; }
        .content { padding: 40px 30px; color: hsl(220, 20%, 15%); line-height: 1.6; }
        .greeting { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: hsl(213, 94%, 59%); }
        .warning-icon { font-size: 48px; text-align: center; margin: 20px 0; }
        .message { font-size: 16px; margin-bottom: 25px; }
        .alert-box { background-color: hsl(0, 84%, 95%); border-left: 4px solid hsl(0, 84%, 60%); padding: 20px; margin: 25px 0; border-radius: 4px; }
        .alert-text { color: hsl(0, 84%, 40%); margin: 0; font-weight: 500; }
        .cta-container { text-align: center; margin: 35px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, hsl(213, 94%, 59%), hsl(217, 91%, 68%)); color: hsl(0, 0%, 100%); padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; }
        .cta-button:hover { transform: translateY(-2px); box-shadow: 0 8px 25px hsla(213, 94%, 59%, 0.3); }
        .support-box { background-color: hsl(220, 15%, 97%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; }
        .footer { background-color: hsl(220, 15%, 97%); padding: 30px 20px; text-align: center; color: hsl(220, 8%, 46%); font-size: 14px; }
        .footer a { color: hsl(213, 94%, 59%); text-decoration: none; }
        @media only screen and (max-width: 600px) {
            .content { padding: 30px 20px; }
            .greeting { font-size: 20px; }
            .cta-button { padding: 14px 28px; font-size: 15px; }
            .warning-icon { font-size: 36px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{{companyLogoUrl}}" alt="Logo" class="logo">
        </div>
        
        <div class="content">
            <div class="warning-icon">⚠️</div>
            
            <div class="greeting">Olá {{customerName}},</div>
            
            <div class="alert-box">
                <div class="alert-text">
                    Infelizmente, não conseguimos processar seu último pagamento e sua assinatura não está ativa no momento.
                </div>
            </div>
            
            <div class="message">
                Isso pode acontecer por diversos motivos, como:
            </div>
            
            <div style="margin: 20px 0; padding-left: 20px;">
                <div style="margin: 8px 0;">• Cartão com dados desatualizados</div>
                <div style="margin: 8px 0;">• Limite de crédito insuficiente</div>
                <div style="margin: 8px 0;">• Cartão vencido</div>
                <div style="margin: 8px 0;">• Problemas temporários com o banco</div>
            </div>
            
            <div class="message">
                Para reativar sua assinatura, clique no botão abaixo para atualizar seus dados de pagamento:
            </div>
            
            <div class="cta-container">
                <a href="#" class="cta-button">Atualizar Pagamento</a>
            </div>
            
            <div class="support-box">
                <div style="font-weight: 600; margin-bottom: 10px; color: hsl(213, 94%, 59%);">
                    Precisa de ajuda? 🤝
                </div>
                <div>
                    Nossa equipe está aqui para ajudar! Entre em contato conosco e resolveremos isso juntos rapidamente.
                </div>
            </div>
            
            <div class="message">
                Estamos ansiosos para tê-lo(a) de volta em sua jornada fitness! 💪
            </div>
            
            <div style="margin-top: 30px; font-weight: 600;">
                Atenciosamente,<br>
                Equipe {{companyName}}
            </div>
        </div>
        
        <div class="footer">
            <div>
                Precisa de ajuda? Entre em contato: <a href="mailto:suporte@{{companyName}}.com">suporte@{{companyName}}.com</a>
            </div>
            <div style="margin-top: 15px;">
                <a href="#">Cancelar inscrição</a> | <a href="#">Política de Privacidade</a>
            </div>
        </div>
    </div>
</body>
</html>`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Templates de Email</h1>
          <p className="text-muted-foreground mb-8">
            Templates HTML responsivos para emails transacionais em português
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Welcome Email Template */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  1. Email de Boas-vindas
                </h2>
                <button
                  onClick={() => copyToClipboard(welcomeEmailHTML, 'welcome')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {copiedTemplate === 'welcome' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar HTML
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Assunto:</strong> 🎉 Bem-vindo(a) à sua transformação fitness!
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden bg-card">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Preview</span>
                </div>
                <div 
                  className="h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: welcomeEmailHTML }}
                />
              </div>
            </div>

            {/* Payment Failed Email Template */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  2. Email de Falha no Pagamento
                </h2>
                <button
                  onClick={() => copyToClipboard(paymentFailedEmailHTML, 'payment-failed')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {copiedTemplate === 'payment-failed' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar HTML
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Assunto:</strong> ⚠️ Houve um problema com seu pagamento
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden bg-card">
                <div className="bg-muted px-4 py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">Preview</span>
                </div>
                <div 
                  className="h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: paymentFailedEmailHTML }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Variáveis Disponíveis
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Dados do Cliente:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li><code className="bg-background px-1 rounded">{"{{customerName}}"}</code> - Nome do cliente</li>
                  <li><code className="bg-background px-1 rounded">{"{{companyName}}"}</code> - Nome da empresa</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Recursos:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li><code className="bg-background px-1 rounded">{"{{companyLogoUrl}}"}</code> - URL do logo</li>
                  <li>Links de CTA configuráveis</li>
                  <li>Design responsivo incluído</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;