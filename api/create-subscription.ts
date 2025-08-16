import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('🚀 [create-subscription] Request received:', {
      method: req.method,
      body: req.body,
      headers: req.headers
    });

    if (req.method !== 'POST') {
      console.log('❌ [create-subscription] Method not allowed:', req.method);
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.log('❌ [create-subscription] Stripe secret key missing');
      return res.status(500).json({ error: 'Configuração do Stripe ausente' });
    }

    const stripe = new Stripe(stripeSecretKey);
    const { setup_intent_id, customer_id, price_id, plan_type, plan_name, email, name, phone } = req.body;

    console.log('🔍 [create-subscription] Request parameters:', {
      setup_intent_id,
      customer_id,
      price_id,
      plan_type,
      plan_name,
      email,
      name,
      phone
    });

    if (!setup_intent_id || !customer_id || !price_id) {
      console.log('❌ [create-subscription] Missing required parameters:', {
        has_setup_intent_id: !!setup_intent_id,
        has_customer_id: !!customer_id,
        has_price_id: !!price_id
      });
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes' });
    }

    console.log('🔍 [create-subscription] Retrieving setup intent...');
    
    // Get the setup intent to retrieve the payment method
    const setupIntent = await stripe.setupIntents.retrieve(setup_intent_id);
    
    console.log('🔍 [create-subscription] Setup intent status:', setupIntent.status);
    
    if (setupIntent.status !== 'succeeded') {
      console.log('❌ [create-subscription] Setup Intent not succeeded:', setupIntent.status);
      return res.status(400).json({ error: 'Setup Intent não foi confirmado' });
    }

    console.log('🔍 [create-subscription] Checking for existing active subscriptions...');
    
    // Check for existing active subscriptions for this customer
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customer_id,
      status: 'active',
      limit: 100,
    });

    console.log('🔍 [create-subscription] Existing subscriptions found:', {
      customer_id,
      subscriptionCount: existingSubscriptions.data.length,
      subscriptions: existingSubscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        plan_name: sub.metadata.plan_name || 'N/A',
        created: sub.created
      }))
    });

    if (existingSubscriptions.data.length > 0) {
      console.log('❌ [create-subscription] Customer already has active subscription, blocking creation');
      return res.status(400).json({ 
        error: 'Usuário já possui uma assinatura ativa',
        details: 'Não é permitido ter mais de uma assinatura ativa simultaneamente'
      });
    }

    console.log('✅ [create-subscription] No existing subscriptions found, proceeding with creation...');

    // Update customer with email and name and phone if provided
    if (email || name || phone) {
      console.log('🔍 [create-subscription] Updating customer with:', { email, name, phone });
      const updateData: { email?: string; name?: string; phone?: string } = {};
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      
      await stripe.customers.update(customer_id, updateData);
      console.log('✅ [create-subscription] Customer updated successfully');
    }

    console.log('🚀 [create-subscription] Creating subscription...');
    
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
        customer_phone: phone || '',
        customer_name: name || '',
      },
    });

    console.log('✅ [create-subscription] Subscription created successfully:', {
      subscription_id: subscription.id,
      status: subscription.status,
      customer_id: subscription.customer,
      plan_type: subscription.metadata.plan_type,
      plan_name: subscription.metadata.plan_name
    });

    // Get the latest invoice to check for PDF URL
    let invoicePdfUrl: string | null = null;
    if (subscription.latest_invoice && typeof subscription.latest_invoice === 'object') {
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      invoicePdfUrl = invoice.invoice_pdf || null;
      console.log('🔍 [create-subscription] Invoice PDF URL:', invoicePdfUrl);
    }

    return res.status(200).json({
      subscription_id: subscription.id,
      status: subscription.status,
      latest_invoice: subscription.latest_invoice,
      invoice_pdf_url: invoicePdfUrl,
    });

  } catch (error: unknown) {
    console.error('💥 [create-subscription] Error creating subscription:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: req.body
    });
    return res.status(500).json({ 
      error: 'Erro ao criar assinatura',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}