import { buffer } from "micro";
import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { api: { bodyParser: false } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return res.status(500).json({ error: "Configuração do Stripe ausente" });
  }

  const stripe = new Stripe(stripeSecretKey);

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(buf, sig!, webhookSecret);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`❌ Erro na verificação do webhook: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        console.log("✅ Checkout concluído:", event.data.object.id);
        break;

      case "invoice.payment_succeeded":
        console.log("💰 Pagamento de assinatura OK:", event.data.object.id);
        break;

      case "invoice.payment_failed":
        console.log("⚠️ Pagamento falhou:", event.data.object.id);
        break;

      case "customer.subscription.deleted":
        console.log("🛑 Assinatura cancelada:", event.data.object.id);
        break;

      default:
        console.log(`ℹ️ Evento não tratado: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: unknown) {
    console.error("Erro ao processar evento:", error);
    return res.status(500).json({ error: "Erro ao processar webhook" });
  }
}
