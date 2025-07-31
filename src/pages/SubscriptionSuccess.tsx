/**
 * Subscription Success Page
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function SubscriptionSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-fitness-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Assinatura Confirmada!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Sua assinatura foi criada com sucesso. Você receberá um email de confirmação em breve.
          </p>
          
          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">Próximos passos:</p>
            <ul className="text-left space-y-1">
              <li>• Verifique seu email para detalhes da assinatura</li>
              <li>• Entre em contato para agendar sua primeira sessão</li>
              <li>• Acesse seu painel de acompanhamento</li>
            </ul>
          </div>
          
          <Button asChild className="w-full">
            <Link to="/">
              Voltar ao Site
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}