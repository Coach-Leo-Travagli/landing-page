import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('🔍 [check-existing-subscription] Request received:', {
      method: req.method,
      body: req.body,
      headers: req.headers
    });

    if (req.method !== 'POST') {
      console.log('❌ [check-existing-subscription] Method not allowed:', req.method);
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.log('❌ [check-existing-subscription] Stripe secret key missing');
      return res.status(500).json({ error: 'Configuração do Stripe ausente' });
    }

    const stripe = new Stripe(stripeSecretKey);
    const { customer_id } = req.body;

    console.log('🔍 [check-existing-subscription] Checking for customer_id:', customer_id);

    if (!customer_id) {
      console.log('❌ [check-existing-subscription] Missing customer_id in request body');
      return res.status(400).json({ error: 'ID do cliente é obrigatório' });
    }

    console.log('🔍 [check-existing-subscription] Querying Stripe for subscriptions...');
    
    // Check for existing active subscriptions for this customer
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customer_id,
      status: 'active',
      limit: 100,
    });

    console.log('🔍 [check-existing-subscription] Stripe response:', {
      customer_id,
      subscriptionCount: existingSubscriptions.data.length,
              subscriptions: existingSubscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          plan_name: sub.metadata.plan_name || 'N/A',
          created: sub.created
        }))
    });

    const hasActiveSubscription = existingSubscriptions.data.length > 0;

    console.log('🔍 [check-existing-subscription] Result:', {
      customer_id,
      hasActiveSubscription,
      subscriptionCount: existingSubscriptions.data.length
    });

    return res.status(200).json({
      hasActiveSubscription,
      subscriptionCount: existingSubscriptions.data.length,
      subscriptions: hasActiveSubscription ? existingSubscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        plan_name: sub.metadata.plan_name || 'N/A',
        created: sub.created
      })) : [],
    });

  } catch (error: unknown) {
    console.error('💥 [check-existing-subscription] Error checking existing subscription:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      customer_id: req.body?.customer_id
    });
    return res.status(500).json({ 
      error: 'Erro ao verificar assinatura existente',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
