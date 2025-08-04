import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Mail, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function Success() {
  const [searchParams] = useSearchParams();
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // In a real implementation, you might want to fetch session details
    // from your backend to show more specific information
    const email = searchParams.get('email');
    if (email) {
      setCustomerEmail(email);
    }
  }, [searchParams]);

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText('suporte@coachtravagli.com');
      toast.success('Email copiado para a área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-light to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-fitness-hero border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-black text-fitness-dark mb-4">
              Pagamento Realizado com Sucesso!
            </CardTitle>
            
            <p className="text-lg text-muted-foreground">
              Parabéns! Sua assinatura foi ativada com sucesso.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-fitness-light/30 rounded-lg p-6 space-y-4">
              <h3 className="font-bold text-fitness-dark flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Próximos Passos
              </h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>
                    Um email de confirmação foi enviado para{' '}
                    {customerEmail ? (
                      <strong>{customerEmail}</strong>
                    ) : (
                      'seu endereço de email'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>
                    Você receberá suas credenciais de acesso em até 24 horas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>
                    Nossa equipe entrará em contato para o onboarding personalizado
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>
                    Sua cobrança mensal será automática na data de hoje de cada mês
                  </span>
                </li>
              </ul>
            </div>

            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">
                  <strong>ID da Sessão:</strong> {sessionId}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Guarde este número para referência futura
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild variant="default" size="lg" className="flex-1">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Baixar Comprovante
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Precisa de ajuda? Entre em contato conosco:{' '}
                <a 
                  onClick={handleEmailCopy}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  suporte@coachtravagli.com
                </a>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                WhatsApp: <a href="https://wa.me/5511999999999?text=Oi" className="text-primary hover:underline font-medium cursor-pointer" target="_blank" rel="noopener noreferrer">+55 (11) 99999-9999</a> • Atendimento: Seg-Sex 8h às 18h
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}