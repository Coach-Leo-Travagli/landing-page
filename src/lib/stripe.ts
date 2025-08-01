import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with public key
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  throw new Error('VITE_STRIPE_PUBLIC_KEY is not defined in environment variables');
}

export const stripePromise = loadStripe(stripePublicKey);

// Plan configurations
export const STRIPE_PLANS = {
  basic: {
    name: 'Básico',
    price: 129,
    priceId: 'price_basic_monthly', // Replace with actual Stripe Price ID
    features: [
      'Planos de treino personalizados',
      'Biblioteca de vídeos de exercícios',
      'Acompanhamento de progresso',
      'Diretrizes básicas de nutrição',
      'Suporte por email'
    ]
  },
  standard: {
    name: 'Padrão',
    price: 199,
    priceId: 'price_standard_monthly', // Replace with actual Stripe Price ID
    features: [
      'Tudo do plano Básico',
      'Planos de refeições personalizados',
      'Recomendações de suplementos',
      'Check-ins semanais de progresso',
      'Suporte prioritário por chat',
      'Acesso ao banco de receitas'
    ]
  },
  vip: {
    name: 'VIP',
    price: 399,
    priceId: 'price_vip_monthly', // Replace with actual Stripe Price ID
    features: [
      'Tudo do plano Padrão',
      'Videochamadas 1-a-1 (2x/mês)',
      'Suporte 24/7 do personal trainer',
      'Planejamento de meal prep',
      'Análise de composição corporal',
      'Ajustes prioritários no plano',
      'Acesso à comunidade exclusiva'
    ]
  }
} as const;

export type PlanType = keyof typeof STRIPE_PLANS;

// Checkout session creation
export const createCheckoutSession = async (planType: PlanType) => {
  const plan = STRIPE_PLANS[planType];
  
  if (!plan) {
    throw new Error(`Plano inválido: ${planType}`);
  }

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: plan.priceId,
        planType: planType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar sessão de checkout');
    }

    return data.url;
  } catch (error) {
    console.error('Erro ao criar checkout session:', error);
    throw new Error('Não foi possível processar o pagamento. Tente novamente.');
  }
};