/**
 * Payment Success Page
 * 
 * This page is displayed when users return from successful Mercado Pago payments.
 * It handles various payment states and provides appropriate feedback to users.
 */

import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  Home, 
  Mail, 
  Download,
  ArrowRight
} from 'lucide-react';

// Payment status types from Mercado Pago
type PaymentStatus = 'approved' | 'pending' | 'in_process' | 'rejected' | 'cancelled';

interface PaymentInfo {
  paymentId?: string;
  status?: PaymentStatus;
  statusDetail?: string;
  merchantOrderId?: string;
  preferenceId?: string;
  externalReference?: string;
}

/**
 * Success page component for handling payment confirmations
 */
export default function Success() {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract payment information from URL parameters
    const info: PaymentInfo = {
      paymentId: searchParams.get('payment_id') || undefined,
      status: (searchParams.get('status') as PaymentStatus) || undefined,
      statusDetail: searchParams.get('status_detail') || undefined,
      merchantOrderId: searchParams.get('merchant_order_id') || undefined,
      preferenceId: searchParams.get('preference_id') || undefined,
      externalReference: searchParams.get('external_reference') || undefined,
    };

    setPaymentInfo(info);
    setIsLoading(false);

    // Log payment information for debugging
    console.log('Payment callback received:', info);
  }, [searchParams]);

  /**
   * Gets the appropriate icon based on payment status
   */
  const getStatusIcon = () => {
    switch (paymentInfo.status) {
      case 'approved':
        return <CheckCircle2 className="w-16 h-16 text-green-500" />;
      case 'pending':
      case 'in_process':
        return <Clock className="w-16 h-16 text-yellow-500" />;
      default:
        return <CheckCircle2 className="w-16 h-16 text-green-500" />;
    }
  };

  /**
   * Gets the status message and color
   */
  const getStatusInfo = () => {
    switch (paymentInfo.status) {
      case 'approved':
        return {
          title: 'Pagamento Aprovado!',
          message: 'Seu pagamento foi processado com sucesso.',
          badgeVariant: 'default' as const,
          badgeText: 'Aprovado',
        };
      case 'pending':
        return {
          title: 'Pagamento Pendente',
          message: 'Seu pagamento está sendo processado. Você receberá uma confirmação em breve.',
          badgeVariant: 'secondary' as const,
          badgeText: 'Pendente',
        };
      case 'in_process':
        return {
          title: 'Pagamento em Processamento',
          message: 'Seu pagamento está sendo analisado. Aguarde a confirmação.',
          badgeVariant: 'secondary' as const,
          badgeText: 'Processando',
        };
      default:
        return {
          title: 'Pagamento Recebido',
          message: 'Recebemos seu pagamento e estamos processando.',
          badgeVariant: 'default' as const,
          badgeText: 'Recebido',
        };
    }
  };

  /**
   * Determines if this is a coaching plan purchase
   */
  const isCoachingPlan = () => {
    return paymentInfo.externalReference?.includes('coaching_plan');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fitness-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processando informações do pagamento...</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-fitness-light py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-fitness-card">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-3xl font-black text-fitness-dark mb-2">
              {statusInfo.title}
            </CardTitle>
            <Badge variant={statusInfo.badgeVariant} className="mb-4">
              {statusInfo.badgeText}
            </Badge>
            <p className="text-muted-foreground text-lg">
              {statusInfo.message}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Details */}
            {paymentInfo.paymentId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-fitness-dark mb-3">Detalhes do Pagamento</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID do Pagamento:</span>
                    <span className="font-medium">{paymentInfo.paymentId}</span>
                  </div>
                  {paymentInfo.merchantOrderId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID do Pedido:</span>
                      <span className="font-medium">{paymentInfo.merchantOrderId}</span>
                    </div>
                  )}
                  {paymentInfo.statusDetail && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status Detalhado:</span>
                      <span className="font-medium">{paymentInfo.statusDetail}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Steps for Coaching Plans */}
            {isCoachingPlan() && paymentInfo.status === 'approved' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Próximos Passos
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Você receberá um e-mail com instruções detalhadas em até 24 horas
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Nossa equipe entrará em contato para agendar sua primeira sessão
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Acesso ao app exclusivo será liberado dentro de 24 horas
                  </li>
                </ul>
              </div>
            )}

            {/* Pending Payment Information */}
            {(paymentInfo.status === 'pending' || paymentInfo.status === 'in_process') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  O que acontece agora?
                </h3>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Acompanhe o status do seu pagamento por e-mail
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    A confirmação pode levar até 2 dias úteis
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Você receberá uma notificação assim que for aprovado
                  </li>
                </ul>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-fitness-dark mb-3">Precisa de Ajuda?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Entre em contato conosco se tiver dúvidas sobre seu pagamento ou plano.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:suporte@fitnesscoach.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Suporte por E-mail
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
              {paymentInfo.status === 'approved' && (
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Comprovante
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Este comprovante é válido e pode ser usado para seus registros.
            <br />
            Para dúvidas sobre faturamento, entre em contato com nosso suporte.
          </p>
        </div>
      </div>
    </div>
  );
}