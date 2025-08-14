import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

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
    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).json({ error: 'ID do cliente é obrigatório' });
    }

    // Check for existing active subscriptions for this customer
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customer_id,
      status: 'active',
      limit: 100,
    });

    const hasActiveSubscription = existingSubscriptions.data.length > 0;

    return res.status(200).json({
      hasActiveSubscription,
      subscriptionCount: existingSubscriptions.data.length,
      subscriptions: hasActiveSubscription ? existingSubscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        plan_name: sub.metadata.plan_name || 'N/A',
        created: sub.created,
      })) : [],
    });

  } catch (error: unknown) {
    console.error('💥 Error checking existing subscription:', error);
    return res.status(500).json({ 
      error: 'Erro ao verificar assinatura existente',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
