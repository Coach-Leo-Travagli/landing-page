import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ error: 'Configuração do Stripe ausente' });
    }

    const { subscription_id } = req.query;

    if (!subscription_id || typeof subscription_id !== 'string') {
      return res.status(400).json({ error: 'ID da assinatura é obrigatório' });
    }

    const stripe = new Stripe(stripeSecretKey);

    // Get the subscription with latest invoice
    const subscription = await stripe.subscriptions.retrieve(subscription_id, {
      expand: ['latest_invoice'],
    });

    if (!subscription.latest_invoice || typeof subscription.latest_invoice === 'string') {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const invoicePdfUrl = invoice.invoice_pdf;

    return res.status(200).json({
      invoice_pdf_url: invoicePdfUrl,
      invoice_id: invoice.id,
      status: invoice.status,
    });

  } catch (error: unknown) {
    console.error('💥 Error fetching invoice PDF:', error);
    return res.status(500).json({ 
      error: 'Erro ao buscar comprovante',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 