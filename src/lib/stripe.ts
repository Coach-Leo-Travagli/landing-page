import { loadStripe } from '@stripe/stripe-js';
import { PLANS, type PlanType } from '@/utils/plans';

// Initialize Stripe with public key (optional for development environments)
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Only initialize Stripe if the public key is available
export const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

// Re-export for backwards compatibility
export const STRIPE_PLANS = PLANS;
export type { PlanType };

// Checkout session creation
export const createCheckoutSession = async (planType: PlanType) => {
  // Check if Stripe is available
  if (!stripePublicKey) {
    throw new Error('Stripe não está configurado. Configure VITE_STRIPE_PUBLIC_KEY para usar pagamentos.');
  }

  const plan = PLANS[planType];
  
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