import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const PLANS = {
  basic: {
    name: 'Plano Básico',
    priceId: process.env.STRIPE_PRICE_BASIC_ID || 'price_basic_monthly',
  },
  standard: {
    name: 'Plano Padrão',
    priceId: process.env.STRIPE_PRICE_STANDARD_ID || 'price_standard_monthly',
  },
  vip: {
    name: 'Plano VIP',
    priceId: process.env.STRIPE_PRICE_VIP_ID || 'price_vip_monthly',
  },
} as const;

const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ error: 'Configuração do Stripe ausente' });
    }

    const stripe = new Stripe(stripeSecretKey);

    const { priceId, planType } = req.body;

    if (!planType || !(planType in PLANS)) {
      return res.status(400).json({ error: 'Tipo de plano inválido' });
    }

    const plan = PLANS[planType as keyof typeof PLANS];
    const actualPriceId = priceId || plan.priceId;

    const origin = req.headers.origin 
      || (req.headers.host ? `https://${req.headers.host}` : 'http://localhost:5173');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: actualPriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      customer_creation: 'always',
      billing_address_collection: 'required',
      payment_method_collection: 'always',
      subscription_data: {
        trial_period_days: 0,
        metadata: { plan_type: planType, plan_name: plan.name, duration_months: '12' },
      },
      metadata: { plan_type: planType, plan_name: plan.name },
      locale: 'pt-BR',
      automatic_tax: { enabled: false },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error: unknown) {
    console.error('💥 Error occurred:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' });
     }
};

export default handler;
