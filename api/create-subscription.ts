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
    const { setup_intent_id, payment_method_id, price_id, plan_type, plan_name, email } = req.body;

    if (!setup_intent_id || !payment_method_id || !price_id) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
    }

    // Get the setup intent to verify it succeeded
    const setupIntent = await stripe.setupIntents.retrieve(setup_intent_id);
    
    if (setupIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Setup Intent não foi confirmado' });
    }

    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id as string);
    
    // Create or get customer with email from payment method
    const customerEmail = email || paymentMethod.billing_details?.email || '';
    
    let customer;
    if (customerEmail) {
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: customerEmail,
          payment_method: payment_method_id as string,
          metadata: {
            plan_type: plan_type || '',
            plan_name: plan_name || '',
          },
        });
      }
    } else {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Attach payment method to customer if not already attached
    if (paymentMethod.customer !== customer.id) {
      await stripe.paymentMethods.attach(payment_method_id as string, {
        customer: customer.id,
      });
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      default_payment_method: payment_method_id as string,
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        plan_type: plan_type || '',
        plan_name: plan_name || '',
        customer_email: customerEmail,
      },
    });

    return res.status(200).json({
      subscription_id: subscription.id,
      status: subscription.status,
      customer_id: customer.id,
      customer_email: customerEmail,
    });

  } catch (error: unknown) {
    console.error('💥 Error creating subscription:', error);
    return res.status(500).json({ 
      error: 'Erro ao criar assinatura',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}