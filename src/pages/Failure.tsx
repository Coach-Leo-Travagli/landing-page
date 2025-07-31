/**
 * Payment Failure Page
 * 
 * This page is displayed when users return from failed or cancelled Mercado Pago payments.
 * It provides helpful information and options for retry or alternative payment methods.
 */

import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  XCircle, 
  AlertCircle, 
  Home, 
  RotateCcw, 
  CreditCard,
  Mail,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

// Failure reason types from Mercado Pago
type FailureReason = 
  | 'cc_rejected_bad_filled_card_number'
  | 'cc_rejected_bad_filled_date'
  | 'cc_rejected_bad_filled_other'
  | 'cc_rejected_bad_filled_security_code'
  | 'cc_rejected_blacklist'
  | 'cc_rejected_call_for_authorize'
  | 'cc_rejected_card_disabled'
  | 'cc_rejected_card_error'
  | 'cc_rejected_duplicated_payment'
  | 'cc_rejected_high_risk'
  | 'cc_rejected_insufficient_amount'
  | 'cc_rejected_invalid_installments'
  | 'cc_rejected_max_attempts'
  | 'cc_rejected_other_reason'
  | 'user_cancelled'
  | 'expired'
  | 'rejected';

interface PaymentFailureInfo {
  paymentId?: string;
  status?: string;
  statusDetail?: FailureReason;
  merchantOrderId?: string;
  preferenceId?: string;
  externalReference?: string;
}

/**
 * Failure page component for handling payment errors
 */
export default function Failure() {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<PaymentFailureInfo>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Extract payment information from URL parameters
    const info: PaymentFailureInfo = {
      paymentId: searchParams.get('payment_id') || undefined,
      status: searchParams.get('status') || undefined,
      statusDetail: (searchParams.get('status_detail') as FailureReason) || undefined,
      merchantOrderId: searchParams.get('merchant_order_id') || undefined,
      preferenceId: searchParams.get('preference_id') || undefined,
      externalReference: searchParams.get('external_reference') || undefined,
    };

    setPaymentInfo(info);
    setIsLoading(false);

    // Log payment failure information for debugging
    console.log('Payment failure callback received:', info);
  }, [searchParams]);

  /**
   * Gets user-friendly error message based on status detail
   */
  const getErrorMessage = (): { title: string; message: string; suggestion: string } => {
    switch (paymentInfo.statusDetail) {
      case 'cc_rejected_bad_filled_card_number':
        return {
          title: 'Número do cartão inválido',
          message: 'O número do cartão informado não é válido.',
          suggestion: 'Verifique o número do cartão e tente novamente.'
        };
      
      case 'cc_rejected_bad_filled_date':
        return {
          title: 'Data de validade inválida',
          message: 'A data de validade do cartão está incorreta.',
          suggestion: 'Verifique a data de validade e tente novamente.'
        };
      
      case 'cc_rejected_bad_filled_security_code':
        return {
          title: 'Código de segurança inválido',
          message: 'O código de segurança (CVV) informado está incorreto.',
          suggestion: 'Verifique o código de 3 ou 4 dígitos no verso do cartão.'
        };
      
      case 'cc_rejected_insufficient_amount':
        return {
          title: 'Saldo insuficiente',
          message: 'Não há saldo suficiente no cartão para realizar esta compra.',
          suggestion: 'Tente com outro cartão ou método de pagamento.'
        };
      
      case 'cc_rejected_card_disabled':
        return {
          title: 'Cartão desabilitado',
          message: 'Seu cartão está temporariamente bloqueado ou desabilitado.',
          suggestion: 'Entre em contato com seu banco ou tente outro cartão.'
        };
      
      case 'cc_rejected_call_for_authorize':
        return {
          title: 'Autorização necessária',
          message: 'O banco precisa autorizar esta transação.',
          suggestion: 'Entre em contato com seu banco para autorizar a compra.'
        };
      
      case 'cc_rejected_max_attempts':
        return {
          title: 'Muitas tentativas',
          message: 'Foram feitas muitas tentativas com este cartão.',
          suggestion: 'Aguarde algumas horas ou use outro cartão.'
        };
      
      case 'user_cancelled':
        return {
          title: 'Pagamento cancelado',
          message: 'Você cancelou o pagamento.',
          suggestion: 'Você pode tentar novamente quando desejar.'
        };
      
      case 'expired':
        return {
          title: 'Sessão expirada',
          message: 'A sessão de pagamento expirou.',
          suggestion: 'Inicie um novo processo de pagamento.'
        };
      
      default:
        return {
          title: 'Pagamento não processado',
          message: 'Não foi possível processar seu pagamento.',
          suggestion: 'Tente novamente ou use outro método de pagamento.'
        };
    }
  };

  /**
   * Gets retry URL for the same preference
   */
  const getRetryUrl = (): string => {
    return '/'; // Return to home page to retry
  };

  /**
   * Determines if this was a user cancellation
   */
  const wasUserCancelled = (): boolean => {
    return paymentInfo.statusDetail === 'user_cancelled';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-fitness-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processando informações...</p>
        </div>
      </div>
    );
  }

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen bg-fitness-light py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-fitness-card">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              {wasUserCancelled() ? (
                <AlertCircle className="w-16 h-16 text-orange-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-3xl font-black text-fitness-dark mb-2">
              {errorInfo.title}
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              {errorInfo.message}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            {paymentInfo.paymentId && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-3">Detalhes do Erro</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">ID do Pagamento:</span>
                    <span className="font-medium text-red-900">{paymentInfo.paymentId}</span>
                  </div>
                  {paymentInfo.statusDetail && (
                    <div className="flex justify-between">
                      <span className="text-red-700">Código do Erro:</span>
                      <span className="font-medium text-red-900">{paymentInfo.statusDetail}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Suggestion Alert */}
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {errorInfo.suggestion}
              </AlertDescription>
            </Alert>

            {/* Common Solutions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Soluções Comuns</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Verifique se todos os dados do cartão estão corretos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Certifique-se de que há saldo disponível
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Tente usar outro cartão ou método de pagamento
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Entre em contato com seu banco em caso de bloqueios
                </li>
              </ul>
            </div>

            {/* Alternative Payment Methods */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-fitness-dark mb-3">Métodos de Pagamento Alternativos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span>PIX (instantâneo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Boleto bancário</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span>Débito online</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <span>Cartão pré-pago</span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-fitness-dark mb-3">Precisa de Ajuda?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Nossa equipe de suporte está pronta para ajudar você com problemas de pagamento.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:suporte@fitnesscoach.com">
                    <Mail className="w-4 h-4 mr-2" />
                    E-mail de Suporte
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
                <Link to={getRetryUrl()}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>

            {/* Back Link */}
            <div className="text-center pt-4">
              <Button variant="ghost" asChild>
                <Link to="/" className="text-muted-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Escolher outro plano
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Seus dados estão seguros e protegidos.
            <br />
            Nenhuma cobrança foi realizada devido à falha no pagamento.
          </p>
        </div>
      </div>
    </div>
  );
}