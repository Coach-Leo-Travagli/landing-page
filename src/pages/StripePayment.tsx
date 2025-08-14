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
import logoTeamTravagli from "@/assets/logo_team_travagli.png";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// User data form component
function UserDataForm({ 
  onProsseguir,
  isCheckingSubscription,
  hasExistingSubscription
}: { 
  onProsseguir: (name: string, email: string) => void;
  isCheckingSubscription: boolean;
  hasExistingSubscription: boolean;
}) {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleProsseguir = () => {
    // Validate name
    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      return;
    }

    if (name.trim().length < 2) {
      setNameError('Nome deve ter pelo menos 2 caracteres');
      return;
    }

    setNameError('');

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
    onProsseguir(name, email);
  };

  return (
    <div className="space-y-4 rounded-lg shadow-sm border overflow-hidden">
      {/* Name Input */}
      <div className="bg-white px-6 py-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome completo
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError('');
          }}
          placeholder="Seu nome completo"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
            nameError ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isCheckingSubscription}
        />
        {nameError && (
          <p className="mt-2 text-sm text-red-600">{nameError}</p>
        )}
      </div>

      {/* Email Input */}
      <div className="bg-white px-6">
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
          disabled={isCheckingSubscription}
        />
        {emailError && (
          <p className="mt-2 text-sm text-red-600">{emailError}</p>
        )}
      </div>

      {/* Prosseguir Button */}
      <div className="bg-white px-6 py-4">
        <Button 
          type="button"
          onClick={handleProsseguir}
          disabled={isCheckingSubscription || hasExistingSubscription || !name.trim() || !email.trim()}
          className="w-full h-12 text-lg font-semibold"
          size="lg"
        >
          {isCheckingSubscription ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Verificando...
            </div>
          ) : (
            'Prosseguir'
          )}
        </Button>
      </div>
    </div>
  );
}

// Payment form component
function PaymentForm({ 
  clientSecret, 
  planDetails, 
  customerId, 
  setupIntentId,
  name,
  email
}: { 
  clientSecret: string; 
  planDetails: { 
    name: string; 
    price: number; 
    originalPrice: number;
    isPromo: boolean;
    promoLabel: string;
    discountPercentage: number;
    features: string[] 
  }; 
  customerId: string;
  setupIntentId: string;
  name: string;
  email: string;
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

      // Step 2: Confirm the setup intent with payment method from elements
      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success?plan=${planType}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`,
          payment_method_data: {
            billing_details: {
              address: {
                country: "BR",
              },
            },
          },
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
      console.log('🚀 [StripePayment] Creating subscription with data:', {
        setup_intent_id: setupIntent?.id,
        customer_id: customerId,
        price_id: STRIPE_PRICE_IDS[planType as PlanType],
        plan_type: planType,
        plan_name: planDetails.name,
        email: email,
        name: name,
      });
      
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
          name: name,
        }),
      });

      const subscriptionData = await subscriptionResponse.json();
      console.log('🔍 [StripePayment] Subscription creation response:', {
        status: subscriptionResponse.status,
        data: subscriptionData
      });

      if (subscriptionResponse.ok) {
        // Redirect to success page with subscription info
        const successUrl = `/success?subscription_id=${subscriptionData.subscription_id}&plan=${planType}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
        
        // Add invoice PDF URL if available
        if (subscriptionData.invoice_pdf_url) {
          window.location.href = `${successUrl}&invoice_pdf_url=${encodeURIComponent(subscriptionData.invoice_pdf_url)}`;
        } else {
          window.location.href = successUrl;
        }
      } else {
        console.log('❌ [StripePayment] Subscription creation failed:', subscriptionData.error);
        
        if (subscriptionData.error === 'Usuário já possui uma assinatura ativa') {
          console.log('❌ [StripePayment] User has existing subscription, redirecting to cancel');
          toast.error('Você já possui uma assinatura ativa. Não é possível criar uma nova assinatura.');
          // Redirect to cancel page after a delay
          setTimeout(() => {
            navigate('/cancel');
          }, 3000);
        } else {
          console.log('❌ [StripePayment] Other error occurred:', subscriptionData.error);
          toast.error(subscriptionData.error || 'Erro ao criar assinatura');
        }
      }
    } catch (error) {
      console.error('💥 [StripePayment] Error processing subscription:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error('Erro ao processar assinatura');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Método de Pagamento</h3>
        <PaymentElement 
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                address: {
                  country: 'never',
                },
              },
            },
            business: {
              name: 'Team Travagli'
            }
          }}
        />
      </div>
      
      <div className="flex gap-3">
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
          ) : planDetails?.isPromo ? (
            `Assinar por R$ ${planDetails.price}/mês (${planDetails.discountPercentage}% OFF)`
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
  const [planDetails, setPlanDetails] = useState<{ 
    name: string; 
    price: number; 
    originalPrice: number;
    isPromo: boolean;
    promoLabel: string;
    discountPercentage: number;
    features: string[] 
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingSubscription, setHasExistingSubscription] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

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
    const initializePage = async () => {
      try {
        setIsLoading(true);
        
        // Validate plan type
        if (!isValidPlanType(planType)) {
          toast.error('Tipo de plano inválido');
          navigate('/cancel');
          return;
        }
        
        const selectedPlan = plans[planType];
        setPlanDetails(selectedPlan);

        // Don't create setup intent yet - wait for user to provide email
        console.log('✅ [StripePayment] Page initialized, waiting for user data');
        
      } catch (error) {
        console.error('Error initializing page:', error);
        toast.error('Erro ao carregar página');
        setTimeout(() => navigate('/cancel'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [planType, navigate, plans]); // Include all dependencies

  // Function to handle "Prosseguir" button click
  const handleProsseguir = async (name: string, email: string) => {
    try {
      setIsCheckingSubscription(true);
      setUserName(name);
      setUserEmail(email);
      
      console.log('🚀 [StripePayment] Checking for existing subscriptions with email:', { email, planType });
      
      // First, check if a customer with this email already exists and has active subscriptions
      const checkResponse = await fetch('/api/check-existing-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const checkData = await checkResponse.json();
      console.log('🔍 [StripePayment] Existing subscription check response:', checkData);
      
      if (checkData.hasActiveSubscription) {
        console.log('❌ [StripePayment] Customer has existing subscription, blocking access');
        setHasExistingSubscription(true);
        toast.error('Você já possui uma assinatura ativa. Não é possível criar uma nova assinatura.');
        return;
      }
      
      console.log('✅ [StripePayment] No existing subscriptions found, creating setup intent');
      
      // Create setup intent with user data
      const response = await fetch('/api/create-subscription-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          email,
          name,
        }),
      });

      const data = await response.json();
      console.log('🔍 [StripePayment] Subscription intent response:', data);
      
      if (data.client_secret) {
        setClientSecret(data.client_secret);
        setCustomerId(data.customer_id);
        setSetupIntentId(data.setup_intent_id);
        setShowPaymentMethod(true);
        console.log('✅ [StripePayment] Setup intent created, showing payment method');
      } else {
        toast.error('Erro ao inicializar pagamento');
      }
    } catch (error) {
      console.error('💥 [StripePayment] Error in handleProsseguir:', error);
      toast.error('Erro ao verificar dados');
    } finally {
      setIsCheckingSubscription(false);
    }
  };



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
              <div className="flex items-center justify-center gap-4 mb-4">
                <img
                  src={logoTeamTravagli}
                  alt="Team Travagli"
                  className="h-12 w-auto object-contain"
                />
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Finalizar Assinatura
                </h1>
              </div>
              <p className="text-gray-300 text-lg">
                Complete seu pagamento de forma segura
              </p>
            </div>
          </div>

          {/* Existing Subscription Warning */}
          {hasExistingSubscription && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 text-2xl mb-2">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Assinatura Ativa Detectada
                </h3>
                <p className="text-red-700 mb-4">
                  Você já possui uma assinatura ativa. Não é possível criar uma nova assinatura.
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Voltar para o Site
                </Button>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{planDetails?.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getPlan(planType as PlanType)?.popular && (
                        <Badge variant="secondary" className="bg-primary text-white">
                          MAIS POPULAR
                        </Badge>
                      )}
                      {/* {planDetails?.isPromo && (
                        <Badge className="bg-orange-500 text-white animate-promo-pulse">
                          {planDetails.promoLabel}
                        </Badge>
                      )} */}
                    </div>
                  </div>
                  
                  {/* Promotional Pricing */}
                  {planDetails?.isPromo ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg text-gray-400 line-through">
                          R$ {planDetails.originalPrice}
                        </span>
                        {/* <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                          -{planDetails.discountPercentage}%
                        </span> */}
                      </div>
                      <div className="text-4xl font-bold text-primary">
                        R$ {planDetails.price}
                        <span className="text-lg font-normal text-gray-300">/mês</span>
                      </div>
                      <div className="text-sm text-green-400 font-medium">
                        Economia de R$ {planDetails.originalPrice - planDetails.price}!
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-primary">
                      R$ {planDetails?.price}
                      <span className="text-lg font-normal text-gray-300">/mês</span>
                    </div>
                  )}
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
                    
                     {/* Price Lock Message */}
                     {planDetails?.isPromo && (
                       <div className="mt-6 p-4 bg-primary/20 border border-primary/30 rounded-lg">
                         <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-2">
                           <span>🔒</span>
                           <span>Garanta esse desconto para sempre!</span>
                         </div>
                         <p className="text-white/80 text-xs">
                           Seu desconto será mantido mensalmente enquanto a assinatura estiver ativa
                         </p>
                       </div>
                     )}
                     
                     {/* Urgency Message */}
                     {planDetails?.isPromo && (
                       <div className="mt-4 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                         <p className="text-orange-300 text-sm font-medium text-center">
                           ⏰ Aproveite, essa oferta é por tempo limitado!
                         </p>
                       </div>
                     )}
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
                    {!showPaymentMethod ? 'Seus Dados' : 'Dados de Pagamento'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showPaymentMethod ? (
                    <UserDataForm 
                      onProsseguir={handleProsseguir}
                      isCheckingSubscription={isCheckingSubscription}
                      hasExistingSubscription={hasExistingSubscription}
                    />
                  ) : clientSecret ? (
                    <Elements 
                      stripe={stripePromise} 
                      options={{
                        clientSecret,
                        locale: 'pt-BR',
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
                        planDetails={planDetails!} 
                        customerId={customerId}
                        setupIntentId={setupIntentId}
                        name={userName}
                        email={userEmail}
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