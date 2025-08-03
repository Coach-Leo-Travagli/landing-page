import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, Home, RefreshCw, MessageCircle } from 'lucide-react';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-fitness-hero border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <CardTitle className="text-3xl font-black text-fitness-dark mb-4">
              Pagamento Cancelado
            </CardTitle>
            
            <p className="text-lg text-muted-foreground">
              Não se preocupe! Nenhum valor foi cobrado do seu cartão.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-orange-50 rounded-lg p-6 space-y-4">
              <h3 className="font-bold text-fitness-dark">
                O que aconteceu?
              </h3>
              
              <p className="text-sm text-muted-foreground">
                Sua sessão de pagamento foi cancelada antes da finalização. 
                Isso pode ter acontecido porque você:
              </p>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Fechou a página durante o processo</li>
                <li>• Clicou no botão "Voltar" do navegador</li>
                <li>• Decidiu não finalizar a compra neste momento</li>
                <li>• Encontrou algum problema técnico</li>
              </ul>
            </div>

            <div className="bg-fitness-light/30 rounded-lg p-6 space-y-4">
              <h3 className="font-bold text-fitness-dark">
                Ainda quer começar sua transformação?
              </h3>
              
              <p className="text-sm text-muted-foreground">
                Você pode tentar novamente a qualquer momento. Nossos planos 
                continuam disponíveis e nossa equipe está pronta para te ajudar 
                a alcançar seus objetivos fitness.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button asChild variant="default" size="lg" className="flex-1">
                  <Link to="/#pricing">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <a href="https://wa.me/5511999999999?text=Oi" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Falar com Suporte
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button asChild variant="ghost" size="lg">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Dúvidas sobre nossos planos? Entre em contato:{' '}
                <a 
                  href="mailto:suporte@coachtravagli.com" 
                  className="text-primary hover:underline font-medium"
                >
                  suporte@coachtravagli.com
                </a>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                WhatsApp: +55 (11) 99999-9999 • Atendimento: Seg-Sex 8h às 18h
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}