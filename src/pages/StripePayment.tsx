import { useState, useEffect, useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { STRIPE_PRICE_IDS, getPlansForPaymentPage, getPlan, isValidPlanType, type PlanType } from '@/utils/plans';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Payment form component
function PaymentForm({ 
  clientSecret, 
  planDetails, 
  customerId, 
  setupIntentId 
}: { 
  clientSecret: string; 
  planDetails: { name: string; price: number; features: string[] }; 
  customerId: string;
  setupIntentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planType = searchParams.get('plan') || 'standard';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Digite um email válido');
      return;
    }

    setEmailError('');
    setIsLoading(true);

    try {
      // Step 1: Submit elements form first to validate payment details
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        console.error('Submit error:', submitError);
        
        // If user cancelled or there's a validation error
        if (submitError.code === 'canceled' || 
            submitError.type === 'validation_error' ||
            submitError.message?.toLowerCase().includes('cancel')) {
          navigate('/cancel');
          return;
        }
        
        toast.error(submitError.message || 'Erro ao validar dados de pagamento');
        setIsLoading(false);
        return;
      }

      // Step 2: Confirm the setup intent 
      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success?plan=${planType}&email=${encodeURIComponent(email)}`,
        },
        redirect: 'if_required',
      });

      if (setupError) {
        console.error('Setup error:', setupError);
        
        // If user cancelled the payment or there's a specific cancellation error
        if (setupError.code === 'canceled' || 
            setupError.type === 'card_error' ||
            setupError.message?.toLowerCase().includes('cancel')) {
          navigate('/cancel');
          return;
        }
        
        toast.error(setupError.message || 'Erro ao configurar pagamento');
        setIsLoading(false);
        return;
      }

      // Step 4: Create the subscription
      const subscriptionResponse = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setup_intent_id: setupIntent?.id,
          customer_id: customerId,
          price_id: STRIPE_PRICE_IDS[planType as PlanType],
          plan_type: planType,
          plan_name: planDetails.name,
          email: email,
        }),
      });

      const subscriptionData = await subscriptionResponse.json();

      if (subscriptionResponse.ok) {
        // Redirect to success page with subscription info
        window.location.href = `/success?subscription_id=${subscriptionData.subscription_id}&plan=${planType}&email=${encodeURIComponent(email)}`;
      } else {
        toast.error(subscriptionData.error || 'Erro ao criar assinatura');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao processar assinatura');
    }

    setIsLoading(false);
  };

      return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email para cobrança e confirmações
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          placeholder="seu@email.com"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            emailError ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {emailError && (
          <p className="mt-2 text-sm text-red-600">{emailError}</p>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Método de Pagamento</h3>
        <PaymentElement 
          options={{
            layout: 'tabs',
            business: {
              name: 'FitCoach Pro'
            }
          }}
        />
      </div>
      
      <div className="flex gap-3">
        {/* <Button 
          type="button"
          variant="outline" 
          disabled={isLoading}
          onClick={handleCancel}
          className="h-12 px-6"
        >
          Cancelar
        </Button> */}
        
        <Button 
          type="submit" 
          disabled={!stripe || isLoading}
          className="flex-1 h-12 text-lg font-semibold"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando...
            </div>
          ) : (
            `Assinar por R$ ${planDetails?.price || 0}/mês`
          )}
        </Button>
      </div>
    </form>
  );
}

export default function StripePayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [setupIntentId, setSetupIntentId] = useState<string>('');
  const [planDetails, setPlanDetails] = useState<{ name: string; price: number; features: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const planType = searchParams.get('plan') || 'standard';

  // Memoize plans to prevent unnecessary re-renders and API calls
  const plans = useMemo(() => getPlansForPaymentPage(), []);

  // Handle page unload - detect when user navigates away
  useEffect(() => {
    const handlePopState = () => {
      // User clicked back button - redirect to cancel
      navigate('/cancel');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    const initializePage = () => {
      // Validate plan type
      if (!isValidPlanType(planType)) {
        toast.error('Tipo de plano inválido');
        navigate('/cancel');
        return;
      }
      
      const selectedPlan = plans[planType];
      setPlanDetails(selectedPlan);
      setIsLoading(false);
    };

    initializePage();
  }, [planType, navigate, plans]); // Include all dependencies

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fitness-dark via-fitness-primary/20 to-fitness-dark flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Carregando dados de pagamento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-dark via-fitness-primary/20 to-fitness-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/cancel"
              className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar para o site
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Finalizar Assinatura
              </h1>
              <p className="text-gray-300 text-lg">
                Complete seu pagamento de forma segura
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{planDetails?.name}</CardTitle>
                    {getPlan(planType as PlanType)?.popular && (
                      <Badge variant="secondary" className="bg-primary text-white">
                        MAIS POPULAR
                      </Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    R$ {planDetails?.price}
                    <span className="text-lg font-normal text-gray-300">/mês</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-200 mb-4">Incluso no plano:</h4>
                    {planDetails?.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security badges */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4 text-gray-400 text-sm">
                  <span>🔒 Pagamento 100% seguro</span>
                  <span>🛡️ SSL protegido</span>
                </div>
                <p className="text-xs text-gray-500">
                  Seus dados são protegidos pela criptografia SSL de 256 bits
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <Card className="bg-white border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-gray-800">
                    Dados de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clientSecret ? (
                    <Elements 
                      stripe={stripePromise} 
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: '#348df9',
                            colorBackground: '#ffffff',
                            colorText: '#374151',
                            borderRadius: '8px',
                          },
                        },
                      }}
                    >
                      <PaymentForm 
                        clientSecret={clientSecret} 
                        planDetails={planDetails} 
                        customerId={customerId}
                        setupIntentId={setupIntentId}
                      />
                    </Elements>
                  ) : (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Carregando formulário de pagamento...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400 mb-2">
                  Ao confirmar o pagamento, você concorda com nossos{' '}
                  <Link to="/termos-de-servico" className="text-primary hover:underline">
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link to="/politica-de-privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </p>
                <p className="text-xs text-gray-500">
                  Você pode cancelar sua assinatura a qualquer momento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}