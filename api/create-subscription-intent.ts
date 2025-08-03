import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const PLANS = {
  basic: {
    name: 'Plano Básico',
    priceId: process.env.STRIPE_PRICE_BASIC_ID || 'price_1RsSBmDCX7K7Umj2BCugUnyC',
  },
  standard: {
    name: 'Plano Padrão', 
    priceId: process.env.STRIPE_PRICE_STANDARD_ID || 'price_1RsSBmDCX7K7Umj2thhoygiC',
  },
  vip: {
    name: 'Plano VIP',
    priceId: process.env.STRIPE_PRICE_VIP_ID || 'price_1RsSByDCX7K7Umj2YiskvogS',
  },
} as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ error: 'Configuração do Stripe ausente' });
    }

    const stripe = new Stripe(stripeSecretKey);
    const { planType } = req.body;

    if (!planType || !(planType in PLANS)) {
      return res.status(400).json({ error: 'Tipo de plano inválido' });
    }

    const plan = PLANS[planType as keyof typeof PLANS];

    // Create a customer first
    const customer = await stripe.customers.create({
      metadata: {
        plan_type: planType,
        plan_name: plan.name,
      },
    });

    // Create a setup intent for future payments (subscriptions)
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: {
        plan_type: planType,
        plan_name: plan.name,
        price_id: plan.priceId,
      },
    });

    return res.status(200).json({
      client_secret: setupIntent.client_secret,
      customer_id: customer.id,
      setup_intent_id: setupIntent.id,
    });

  } catch (error: unknown) {
    console.error('💥 Error creating subscription intent:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}