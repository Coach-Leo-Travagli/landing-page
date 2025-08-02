import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const sessionId = req.query.session_id as string;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID é obrigatório" });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Configuração do Stripe ausente" });
    }

    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    return res.status(200).json({
      sessionId: session.id,
      customer: session.customer_details,
      subscription: session.subscription,
    });
  } catch (error: unknown) {
    console.error("Erro na página de sucesso:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
