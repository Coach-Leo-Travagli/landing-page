import { buffer } from "micro";
import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../lib/prisma";

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
        console.log("✅ Checkout concluído:", event.data.object.id, JSON.stringify(event.data.object));
        
        // // Save payment event to database
        // try {
        //   const session = event.data.object as Stripe.Checkout.Session;
        //   await prisma.payment.create({
        //     data: {
        //       id: event.id,
        //       customerEmail: session.customer_details?.email || 'unknown',
        //       customerName: session.customer_details?.name || 'unknown',
        //       priceId: session.line_items?.data[0]?.price?.id || 'unknown',
        //       status: session.payment_status || 'unknown',
        //       subscriptionId: session.subscription as string || null,
        //     },
        //   });
        //   console.log("💾 Payment event saved to database (checkout.session.completed):", event.id);
        // } catch (dbError) {
        //   console.error("❌ Database error saving payment event:", dbError);
        //   // Don't break the webhook - continue processing
        // }
        break;

        case "invoice.payment_succeeded":
          console.log("💰 Pagamento de assinatura OK:", event.data.object.id, JSON.stringify(event.data.object));
        
          try {
            const invoice = event.data.object as Stripe.Invoice;
            const lineItem = invoice.lines.data[0];
        
            await prisma.payment.create({
              data: {
                id: event.id,
                customerEmail: invoice.customer_email || "unknown",
                customerName: invoice.customer_name || "unknown",
                priceId: (lineItem as Stripe.InvoiceLineItem)?.pricing?.price_details?.price || "unknown",
                productId: (lineItem as Stripe.InvoiceLineItem)?.pricing?.price_details?.product || "unknown",
                planName: (lineItem as Stripe.InvoiceLineItem)?.metadata?.plan_name || "unknown",
                planType: (lineItem as Stripe.InvoiceLineItem)?.metadata?.plan_type || "unknown",
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: invoice.status || "unknown",
                invoiceStatus: invoice.status || "unknown",
                invoiceUrl: invoice.hosted_invoice_url || "",
                invoicePdf: invoice.invoice_pdf || "",
                subscriptionId:
                  (lineItem as Stripe.InvoiceLineItem)?.parent?.subscription_item_details?.subscription ||
                  invoice.parent?.subscription_details?.subscription ||
                  null,
                subscriptionStart: new Date((lineItem as Stripe.InvoiceLineItem)?.period?.start * 1000),
                subscriptionEnd: new Date((lineItem as Stripe.InvoiceLineItem)?.period?.end * 1000),
              },
            });
        
            console.log("💾 Payment event saved with extended data:", event.id);
          } catch (dbError) {
            console.error("❌ Database error saving payment event:", dbError);
          }
          break;

      case "invoice.payment_failed":
        console.log("⚠️ Pagamento falhou:", event.data.object.id, JSON.stringify(event.data.object));
        
        // // Save payment event to database
        // try {
        //   const invoice = event.data.object as Stripe.Invoice;
        //   const lineItem = invoice.lines.data[0];

        //   await prisma.payment.create({
        //     data: {
        //       id: event.id,
        //       customerEmail: invoice.customer_email || 'unknown',
        //       customerName: invoice.customer_name || 'unknown',
        //       priceId: (lineItem as Stripe.InvoiceLineItem)?.pricing?.price_details?.price || "unknown",
        //       status: invoice.status || "unknown",
        //       subscriptionId:
        //         (lineItem as Stripe.InvoiceLineItem)?.parent?.subscription_item_details?.subscription ||
        //         invoice.parent?.subscription_details?.subscription ||
        //         null,
        //     },
        //   });
        //   console.log("💾 Payment event saved to database (invoice.payment_failed):", event.id);
        // } catch (dbError) {
        //   console.error("❌ Database error saving payment event:", dbError);
        //   // Don't break the webhook - continue processing
        // }
        break;

      case "customer.subscription.deleted":
        console.log("🛑 Assinatura cancelada:", event.data.object.id, JSON.stringify(event.data.object));
        
        // // Save payment event to database
        // try {
        //   const subscription = event.data.object as Stripe.Subscription;
        //   await prisma.payment.create({
        //     data: {
        //       id: event.id,
        //       customerEmail: 'subscription_deleted', // No email in subscription object
        //       customerName: 'subscription_deleted', // No name in subscription object
        //       priceId: subscription.items.data[0]?.price.id || 'unknown',
        //       status: subscription.status || 'unknown',
        //       subscriptionId: subscription.id,
        //     },
        //   });
        //   console.log("💾 Payment event saved to database (customer.subscription.deleted):", event.id);
        // } catch (dbError) {
        //   console.error("❌ Database error saving payment event:", dbError);
        //   // Don't break the webhook - continue processing
        // }
        break;

      default:
        console.log(`ℹ️ Evento não tratado: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: unknown) {
    console.error("Erro ao processar evento:", error);
    // Always return 200 to Stripe even if there's an error
    return res.status(200).json({ error: "Erro ao processar webhook" });
  }
}
