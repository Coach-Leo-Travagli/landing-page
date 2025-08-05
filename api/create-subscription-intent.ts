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
    const { planType, email } = req.body;

    if (!planType || !isValidPlanType(planType)) {
      return res.status(400).json({ error: 'Tipo de plano inválido' });
    }

    const plan = PLANS[planType];

    // Create a customer first
    const customer = await stripe.customers.create({
      email: email || undefined, // Add email if provided
      metadata: {
        plan_type: planType,
        plan_name: plan.name,
      },
      preferred_locales: ['pt-BR'],
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