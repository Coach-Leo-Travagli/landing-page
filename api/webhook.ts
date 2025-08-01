import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const body = JSON.stringify(req.body);
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    console.error('Missing Stripe signature');
    return res.status(400).json({ error: 'Assinatura Stripe ausente' });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).json({ error: 'Verificação da assinatura do webhook falhou' });
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Checkout session completed:', {
          sessionId: session.id,
          customerId: session.customer,
          customerEmail: session.customer_email,
          subscriptionId: session.subscription,
          planType: session.metadata?.plan_type,
          planName: session.metadata?.plan_name,
          amountTotal: session.amount_total,
          currency: session.currency,
        });

        // Here you would typically:
        // 1. Save the subscription to your database
        // 2. Send a welcome email to the customer
        // 3. Grant access to your service
        // 4. Log the successful subscription
        
        // Example: Save to database (implement according to your needs)
        await handleSuccessfulCheckout(session);
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        console.log('Payment failed:', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          subscriptionId: invoice.lines?.data?.[0]?.subscription || 'unknown',
          amountDue: invoice.amount_due,
          currency: invoice.currency,
          attemptCount: invoice.attempt_count,
        });

        // Here you would typically:
        // 1. Send a payment failure notification to the customer
        // 2. Update subscription status in your database
        // 3. Possibly suspend access after multiple failures
        
        await handlePaymentFailed(invoice);
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log('Subscription canceled:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          canceledAt: subscription.canceled_at,
          endedAt: subscription.ended_at,
        });

        // Here you would typically:
        // 1. Update subscription status in your database
        // 2. Revoke access to your service
        // 3. Send a cancellation confirmation email
        
        await handleSubscriptionCanceled(subscription);
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log('Subscription updated:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          endedAt: subscription.ended_at,
        });

        // Handle subscription updates (plan changes, etc.)
        await handleSubscriptionUpdated(subscription);
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Erro ao processar webhook' });
  }
}

// Helper functions for handling different events
async function handleSuccessfulCheckout(session: Stripe.Checkout.Session) {
  // Implement your business logic here
  // Example: Save subscription to database, send welcome email, etc.
  
  console.log('Processing successful checkout for session:', session.id);
  
  // TODO: Implement database operations
  // - Save customer information
  // - Create subscription record
  // - Send welcome email
  // - Grant access to coaching content
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Implement your business logic here
  // Example: Send payment failure notification, update subscription status
  
  console.log('Processing payment failure for invoice:', invoice.id);
  
  // TODO: Implement business logic
  // - Send payment failure email
  // - Update subscription status
  // - Possibly suspend access after multiple failures
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  // Implement your business logic here
  // Example: Revoke access, send cancellation email
  
  console.log('Processing subscription cancellation for:', subscription.id);
  
  // TODO: Implement business logic
  // - Update subscription status in database
  // - Revoke access to coaching content
  // - Send cancellation confirmation email
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Implement your business logic here
  // Example: Handle plan changes, billing updates
  
  console.log('Processing subscription update for:', subscription.id);
  
  // TODO: Implement business logic
  // - Update subscription details in database
  // - Handle plan upgrades/downgrades
  // - Send notification emails if needed
}