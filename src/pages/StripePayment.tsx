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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planType = searchParams.get('plan') || 'standard';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Confirm setup with Stripe (includes email from PaymentElement)
      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
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

      // Step 2: Extract payment method ID - email will be retrieved on backend
      const paymentMethodId = typeof setupIntent.payment_method === 'string' 
        ? setupIntent.payment_method 
        : setupIntent.payment_method?.id || '';
      
      if (!paymentMethodId) {
        toast.error('Erro ao processar método de pagamento');
        setIsLoading(false);
        return;
      }

      // Step 3: Create the subscription
      const subscriptionResponse = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setup_intent_id: setupIntent.id,
          payment_method_id: paymentMethodId,
          price_id: STRIPE_PRICE_IDS[planType as PlanType],
          plan_type: planType,
          plan_name: planDetails.name,
        }),
      });

      const subscriptionData = await subscriptionResponse.json();

      if (subscriptionResponse.ok) {
        // Redirect to success page with subscription info
        const customerEmail = subscriptionData.customer_email || '';
        window.location.href = `/success?subscription_id=${subscriptionData.subscription_id}&plan=${planType}&email=${encodeURIComponent(customerEmail)}`;
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
      {/* Payment Method with Email Collection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <PaymentElement 
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                email: 'auto',
                name: 'auto',
                phone: 'never',
                address: 'never',
              }
            },
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
                  <Elements 
                    stripe={stripePromise} 
                    options={{
                      mode: 'setup',
                      currency: 'brl',
                      setupFutureUsage: 'off_session',
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
                      clientSecret={''} 
                      planDetails={planDetails} 
                      customerId={''}
                      setupIntentId={''}
                    />
                  </Elements>
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