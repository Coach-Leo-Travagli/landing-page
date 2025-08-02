import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

// Plan configurations with actual price amounts
const PLANS = {
  basic: {
    name: 'Plano Básico',
    price: 12900, // R$ 129.00 in cents
    priceId: process.env.STRIPE_PRICE_BASIC_ID || 'price_basic_monthly',
  },
  standard: {
    name: 'Plano Padrão',
    price: 19900, // R$ 199.00 in cents
    priceId: process.env.STRIPE_PRICE_STANDARD_ID || 'price_standard_monthly',
  },
  vip: {
    name: 'Plano VIP',
    price: 39900, // R$ 399.00 in cents
    priceId: process.env.STRIPE_PRICE_VIP_ID || 'price_vip_monthly',
  },
} as const;

type PlanType = keyof typeof PLANS;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Debug environment variables
    console.log('Environment variables:', {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'SET' : 'MISSING',
      STRIPE_PRICE_BASIC_ID: process.env.STRIPE_PRICE_BASIC_ID || 'MISSING',
      STRIPE_PRICE_STANDARD_ID: process.env.STRIPE_PRICE_STANDARD_ID || 'MISSING',
      STRIPE_PRICE_VIP_ID: process.env.STRIPE_PRICE_VIP_ID || 'MISSING',
    });

    const { priceId, planType } = req.body;

    // Validate plan type
    if (!planType || !PLANS[planType as PlanType]) {
      return res.status(400).json({ error: 'Tipo de plano inválido' });
    }

    const plan = PLANS[planType as PlanType];
    
    // Use the priceId from frontend if provided, otherwise use plan config
    const actualPriceId = priceId || plan.priceId;
    
    console.log('Plan details:', {
      planType,
      frontendPriceId: priceId,
      configPriceId: plan.priceId,
      actualPriceId,
    });
    
    // Get the base URL for redirects
    const origin = req.headers.origin || req.headers.host 
      ? `https://${req.headers.host}` 
      : 'http://localhost:5173';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&customer_email={CUSTOMER_EMAIL}`,
      cancel_url: `${origin}/cancel`,
      customer_creation: 'always',
      billing_address_collection: 'required',
      payment_method_collection: 'always',
      subscription_data: {
        trial_period_days: 0, // No trial period
        metadata: {
          plan_type: planType,
          plan_name: plan.name,
          duration_months: '12',
        },
      },
      metadata: {
        plan_type: planType,
        plan_name: plan.name,
      },
      locale: 'pt-BR',
      currency: 'brl',
      // Configure automatic tax calculation if needed
      automatic_tax: {
        enabled: false, // Set to true if you want automatic tax calculation
      },
    });

    // Return the checkout session URL
    return res.status(200).json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    
    // Return appropriate error message
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ error: `Erro do Stripe: ${error.message}` });
    }

    return res.status(500).json({ error: 'Erro interno do servidor. Tente novamente.' });
  }
}