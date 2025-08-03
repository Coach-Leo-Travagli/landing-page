import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

// Import plans configuration
const { PLANS, isValidPlanType } = require('./plans-config.js');

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

    const { priceId, planType } = req.body;

    if (!planType || !isValidPlanType(planType)) {
      return res.status(400).json({ error: 'Tipo de plano inválido' });
    }

    const plan = PLANS[planType];
    const actualPriceId = priceId || plan.priceId;

    const origin = req.headers.origin 
      || (req.headers.host ? `https://${req.headers.host}` : 'http://localhost:5173');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: actualPriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      billing_address_collection: 'required',
      payment_method_collection: 'always',
      subscription_data: {
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
}
