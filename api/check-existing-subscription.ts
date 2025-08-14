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
    const { customer_id, email } = req.body;

    console.log('🔍 [check-existing-subscription] Checking for:', { customer_id, email });

    if (!customer_id && !email) {
      console.log('❌ [check-existing-subscription] Missing both customer_id and email in request body');
      return res.status(400).json({ error: 'ID do cliente ou email é obrigatório' });
    }

    let existingSubscriptions: Stripe.ApiList<Stripe.Subscription> | null = null;

    if (email) {
      // Search by email first
      console.log('🔍 [check-existing-subscription] Searching for customers with email:', email);
      
      const customers = await stripe.customers.list({
        email: email,
        limit: 100,
      });

      console.log('🔍 [check-existing-subscription] Found customers:', customers.data.length);

      if (customers.data.length > 0) {
        // Check subscriptions for all customers with this email
        for (const customer of customers.data) {
          const customerSubscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active',
            limit: 100,
          });

          if (customerSubscriptions.data.length > 0) {
            existingSubscriptions = customerSubscriptions;
            break; // Found active subscription, no need to check more
          }
        }
      }
    } else if (customer_id) {
      // Search by customer_id
      console.log('🔍 [check-existing-subscription] Searching for subscriptions by customer_id:', customer_id);
      
      existingSubscriptions = await stripe.subscriptions.list({
        customer: customer_id,
        status: 'active',
        limit: 100,
      });
    }

    const hasActiveSubscription = existingSubscriptions && existingSubscriptions.data.length > 0;

    console.log('🔍 [check-existing-subscription] Result:', {
      hasActiveSubscription,
      subscriptionCount: existingSubscriptions?.data.length || 0,
      searchMethod: email ? 'email' : 'customer_id'
    });

    return res.status(200).json({
      hasActiveSubscription,
      subscriptionCount: existingSubscriptions?.data.length || 0,
      subscriptions: hasActiveSubscription && existingSubscriptions ? existingSubscriptions.data.map(sub => ({
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
      requestBody: req.body
    });
    return res.status(500).json({ 
      error: 'Erro ao verificar assinatura existente',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
