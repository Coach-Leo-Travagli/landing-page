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
    const { setup_intent_id, customer_id, price_id, plan_type, plan_name, email, name } = req.body;

    if (!setup_intent_id || !customer_id || !price_id) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
    }

    // Get the setup intent to retrieve the payment method
    const setupIntent = await stripe.setupIntents.retrieve(setup_intent_id);
    
    if (setupIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Setup Intent não foi confirmado' });
    }

    // Update customer with email and name if provided
    if (email || name) {
      const updateData: { email?: string; name?: string } = {};
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      
      await stripe.customers.update(customer_id, updateData);
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer_id,
      items: [{ price: price_id }],
      default_payment_method: setupIntent.payment_method as string,
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        plan_type: plan_type || '',
        plan_name: plan_name || '',
        customer_email: email || '',
      },
    });

    return res.status(200).json({
      subscription_id: subscription.id,
      status: subscription.status,
      latest_invoice: subscription.latest_invoice,
    });

  } catch (error: unknown) {
    console.error('💥 Error creating subscription:', error);
    return res.status(500).json({ 
      error: 'Erro ao criar assinatura',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}