/**
 * Subscription Card Form Component
 * 
 * This component collects credit card information for creating subscriptions
 * using Mercado Pago's preapproval plan approach.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  createSubscriptionWithPlan,
  getPlanId,
  type CardToken,
  validateConfiguration,
} from '@/lib/mercadoPago';

interface SubscriptionCardFormProps {
  planName: string;
  monthlyAmount: number;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export default function SubscriptionCardForm({
  planName,
  monthlyAmount,
  onSuccess,
  onError,
  className = '',
}: SubscriptionCardFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    cardholderName: '',
    identificationType: 'CPF',
    identificationNumber: '',
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      handleInputChange('cardNumber', formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate configuration first
    const configValidation = validateConfiguration();
    if (!configValidation.isValid) {
      const errorMessage = `Configuration errors: ${configValidation.errors.join(', ')}`;
      console.error('❌ Configuration validation failed:', configValidation);
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: errorMessage,
      });
      onError?.(new Error(errorMessage));
      return;
    }

    setLoading(true);

    try {
      // Prepare card data
      const cardData: CardToken = {
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expirationMonth: formData.expirationMonth,
        expirationYear: formData.expirationYear,
        securityCode: formData.securityCode,
        cardholderName: formData.cardholderName,
        identificationType: formData.identificationType,
        identificationNumber: formData.identificationNumber,
      };

      console.log('🚀 Starting subscription creation...');

      // Get the plan ID (must be pre-created)
      const planId = getPlanId(planName);
      
      // Create subscription with existing plan
      const subscription = await createSubscriptionWithPlan(
        planId,
        cardData,
        formData.email,
        {
          externalReference: `subscription_${Date.now()}`,
        }
      );

      console.log('✅ Subscription created successfully:', subscription.id);

      toast({
        title: 'Assinatura Criada!',
        description: `Sua assinatura do plano ${planName} foi criada com sucesso.`,
      });

      onSuccess?.(subscription.id!);

      // Reset form
      setFormData({
        email: '',
        cardNumber: '',
        expirationMonth: '',
        expirationYear: '',
        securityCode: '',
        cardholderName: '',
        identificationType: 'CPF',
        identificationNumber: '',
      });

    } catch (error) {
      console.error('❌ Subscription creation failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        variant: 'destructive',
        title: 'Erro na Assinatura',
        description: `Não foi possível criar a assinatura: ${errorMessage}`,
      });

      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Assinatura - {planName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          R$ {monthlyAmount.toFixed(2)} por mês
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Card Number */}
          <div>
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19} // 16 digits + 3 spaces
              required
              disabled={loading}
            />
          </div>

          {/* Expiration and Security Code */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="expirationMonth">Mês</Label>
              <Input
                id="expirationMonth"
                type="text"
                placeholder="MM"
                value={formData.expirationMonth}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 2) handleInputChange('expirationMonth', value);
                }}
                maxLength={2}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="expirationYear">Ano</Label>
              <Input
                id="expirationYear"
                type="text"
                placeholder="AAAA"
                value={formData.expirationYear}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) handleInputChange('expirationYear', value);
                }}
                maxLength={4}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="securityCode">CVV</Label>
              <Input
                id="securityCode"
                type="text"
                placeholder="123"
                value={formData.securityCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) handleInputChange('securityCode', value);
                }}
                maxLength={4}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <Label htmlFor="cardholderName">Nome no Cartão</Label>
            <Input
              id="cardholderName"
              type="text"
              placeholder="João Silva"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Identification */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="identificationType">Tipo</Label>
              <select
                id="identificationType"
                value={formData.identificationType}
                onChange={(e) => handleInputChange('identificationType', e.target.value)}
                className="w-full p-2 border rounded text-sm"
                disabled={loading}
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="identificationNumber">Número</Label>
              <Input
                id="identificationNumber"
                type="text"
                placeholder="123.456.789-00"
                value={formData.identificationNumber}
                onChange={(e) => handleInputChange('identificationNumber', e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando Assinatura...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Assinar por R$ {monthlyAmount.toFixed(2)}/mês
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}