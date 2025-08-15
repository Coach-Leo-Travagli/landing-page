import { buffer } from "micro";
import Stripe from "stripe";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../lib/prisma";
import { sendWelcomeEmail, sendPaymentFailedEmail, sendRenewalEmail, sendCancellationEmail, sendSubscriptionChangeEmail } from "../lib/email";
import { PLANS } from "./plans-config";

export const config = { api: { bodyParser: false } };

// Helper function to get plan details from priceId
function getPlanDetailsByPriceId(priceId: string): { planName: string; planType: string } {
  for (const [planType, planConfig] of Object.entries(PLANS)) {
    if (planConfig.priceId === priceId) {
      return {
        planName: planConfig.name,
        planType: planType
      };
    }
  }
  
  // Fallback: return unknown if no match found
  return {
    planName: "unknown",
    planType: "unknown"
  };
}

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
            
            // Extract customer and subscription data
            const customerEmail = invoice.customer_email || "unknown";
            const customerName = invoice.customer_name || "unknown";
            const stripeCustomerId = invoice.customer as string;
            const subscriptionId = (typeof (lineItem as Stripe.InvoiceLineItem)?.parent?.subscription_item_details?.subscription === 'string' 
              ? (lineItem as Stripe.InvoiceLineItem)?.parent?.subscription_item_details?.subscription 
              : null) ||
              (typeof invoice.parent?.subscription_details?.subscription === 'string'
                ? invoice.parent?.subscription_details?.subscription
                : null) ||
              null;
            
            const planName = (lineItem as Stripe.InvoiceLineItem)?.metadata?.plan_name || "unknown";
            const planType = (lineItem as Stripe.InvoiceLineItem)?.metadata?.plan_type || "unknown";
            const priceId = (lineItem as Stripe.InvoiceLineItem)?.pricing?.price_details?.price || "unknown";
            const productId = (lineItem as Stripe.InvoiceLineItem)?.pricing?.price_details?.product || "unknown";
            const amount = invoice.amount_paid;
            const currency = invoice.currency;
            const subscriptionStart = new Date((lineItem as Stripe.InvoiceLineItem)?.period?.start * 1000);
            const subscriptionEnd = new Date((lineItem as Stripe.InvoiceLineItem)?.period?.end * 1000);
            const invoiceStatus = invoice.status || "unknown";

            // Check if user exists by stripeCustomerId first
            let user = await prisma.user.findUnique({
              where: { stripeCustomerId },
            });

            if (!user) {
              // If not found by stripeCustomerId, check by email
              user = await prisma.user.findUnique({
                where: { email: customerEmail },
              });

              if (user) {
                // User exists with this email but different stripeCustomerId
                // Update the stripeCustomerId to link them
                user = await prisma.user.update({
                  where: { email: customerEmail },
                  data: {
                    stripeCustomerId,
                    subscriptionId,
                    planName,
                    planType,
                    priceId,
                    productId,
                    currency,
                    amount,
                    subscriptionStart,
                    subscriptionEnd,
                    invoiceStatus,
                    updatedAt: new Date(),
                  },
                });
                console.log("👤 Existing user linked with new stripeCustomerId:", user.id);
              } else {
                // Create new user if they don't exist by either stripeCustomerId or email
                user = await prisma.user.create({
                  data: {
                    email: customerEmail,
                    name: customerName,
                    stripeCustomerId,
                    subscriptionId,
                    planName,
                    planType,
                    priceId,
                    productId,
                    currency,
                    amount,
                    subscriptionStart,
                    subscriptionEnd,
                    invoiceStatus,
                  },
                });
                console.log("👤 New user created:", user.id);
              }
            } else {
              // User exists - only update subscription-related fields, not personal info
              user = await prisma.user.update({
                where: { stripeCustomerId },
                data: {
                  subscriptionId,
                  planName,
                  planType,
                  priceId,
                  productId,
                  currency,
                  amount,
                  subscriptionStart,
                  subscriptionEnd,
                  invoiceStatus,
                  updatedAt: new Date(),
                },
              });
              console.log("👤 Existing user updated:", user.id);
            }

            // Determine if this is the first successful invoice for this user
            const previousPaidCount = await prisma.payment.count({
              where: { userId: user.id, invoiceStatus: "paid" },
            });
            const billingReason = (invoice as Stripe.Invoice).billing_reason;
            const isFirstPaidInvoice = billingReason === "subscription_create" || previousPaidCount === 0;

            // Create payment record linked to user
            await prisma.payment.create({
              data: {
                id: event.id,
                status: invoice.status || "unknown",
                amount: invoice.amount_paid,
                currency: invoice.currency,
                invoiceUrl: invoice.hosted_invoice_url || "",
                invoicePdf: invoice.invoice_pdf || "",
                invoiceStatus: invoice.status || "unknown",
                userId: user.id,
              },
            });
        
            console.log("💾 User and Payment records saved:", event.id);

            // Send transactional email based on whether this is the first month or a renewal
            if (isFirstPaidInvoice) {
              await sendWelcomeEmail({
                customerName: customerName,
                customerEmail: customerEmail,
                companyName: "Team Travagli",
                companyLogoUrl: "https://landing-pagee-one.vercel.app/assets/logo_team_travagli-DD5cahtn.png", // TODO: Replace with actual logo URL
              });
            } else {
              await sendRenewalEmail({
                customerName: customerName,
                customerEmail: customerEmail,
                companyName: "Team Travagli",
                companyLogoUrl: "https://landing-pagee-one.vercel.app/assets/logo_team_travagli-DD5cahtn.png",
              });
            }
          } catch (dbError) {
            console.error("❌ Database error saving user/payment records:", dbError);
          }
          break;

      case "invoice.payment_failed":
        console.log("⚠️ Pagamento falhou:", event.data.object.id, JSON.stringify(event.data.object));
        
        try {
          const invoice = event.data.object as Stripe.Invoice;
          const lineItem = invoice.lines.data[0];
          
          // Extract customer data
          const customerEmail = invoice.customer_email || "unknown";
          const customerName = invoice.customer_name || "unknown";
          const stripeCustomerId = invoice.customer as string;

          // Find existing user by stripeCustomerId first, then by email
          let user = await prisma.user.findUnique({
            where: { stripeCustomerId },
          });

          if (!user) {
            // If not found by stripeCustomerId, check by email
            user = await prisma.user.findUnique({
              where: { email: customerEmail },
            });
          }

          if (user) {
            // Create payment record for failed payment
            await prisma.payment.create({
              data: {
                id: event.id,
                status: invoice.status || "failed",
                amount: invoice.amount_due,
                currency: invoice.currency,
                invoiceUrl: invoice.hosted_invoice_url || "",
                invoicePdf: invoice.invoice_pdf || "",
                invoiceStatus: invoice.status || "failed",
                userId: user.id,
              },
            });

            console.log("💾 Failed payment record saved:", event.id);

            // Send payment failed email
            await sendPaymentFailedEmail({
              customerName: customerName,
              customerEmail: customerEmail,
              companyName: "Team Travagli",
              companyLogoUrl: "https://landing-pagee-one.vercel.app/assets/logo_team_travagli-DD5cahtn.png", // TODO: Replace with actual logo URL
            });
          } else {
            console.log("⚠️ User not found for failed payment:", stripeCustomerId);
          }
        } catch (dbError) {
          console.error("❌ Database error saving failed payment:", dbError);
          // Don't break the webhook - continue processing
        }
        break;

      case "customer.subscription.deleted":
        console.log("🛑 Assinatura cancelada:", event.data.object.id, JSON.stringify(event.data.object));
        
        try {
          const subscription = event.data.object as Stripe.Subscription;
          
          // Extract customer and subscription data
          const stripeCustomerId = subscription.customer as string;
          const subscriptionId = subscription.id;
          const canceledAt = subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : new Date();
          const endedAt = subscription.ended_at ? new Date(subscription.ended_at * 1000) : new Date();
          
          // Extract metadata if available
          const customerEmail = subscription.metadata?.customer_email || "unknown";
          const planName = subscription.metadata?.plan_name || "unknown";
          const planType = subscription.metadata?.plan_type || "unknown";
          
          console.log("🔍 Dados do cancelamento:", {
            stripeCustomerId,
            subscriptionId,
            customerEmail,
            planName,
            planType,
            canceledAt: canceledAt.toISOString(),
            endedAt: endedAt.toISOString()
          });

          // Find existing user by stripeCustomerId first, then by email
          let user = await prisma.user.findUnique({
            where: { stripeCustomerId },
          });

          if (!user && customerEmail !== "unknown") {
            // If not found by stripeCustomerId, check by email
            user = await prisma.user.findUnique({
              where: { email: customerEmail },
            });
          }

          if (user) {
            // Update user to reflect subscription cancellation
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionId: null, // Clear subscription ID
                subscriptionEnd: endedAt, // Set end date
                invoiceStatus: "canceled", // Mark as canceled
                updatedAt: new Date(),
              },
            });

            console.log("👤 Usuário atualizado após cancelamento:", {
              userId: updatedUser.id,
              email: updatedUser.email,
              name: updatedUser.name,
              subscriptionEnd: updatedUser.subscriptionEnd?.toISOString()
            });

            // Create payment record for subscription cancellation tracking
            await prisma.payment.create({
              data: {
                id: `${event.id}_cancellation`, // Unique ID for cancellation event
                status: "canceled",
                amount: 0, // No amount for cancellation
                currency: subscription.currency || "brl",
                invoiceUrl: "", // No invoice for cancellation
                invoicePdf: "", // No PDF for cancellation
                invoiceStatus: "canceled",
                userId: user.id,
              },
            });

            console.log("💾 Registro de cancelamento salvo no banco:", event.id);

            // Send cancellation confirmation email
            await sendCancellationEmail({
              customerName: user.name,
              customerEmail: user.email,
              planName: planName,
              canceledAt: canceledAt,
              companyName: "Team Travagli",
              companyLogoUrl: "https://landing-pagee-one.vercel.app/assets/logo_team_travagli-DD5cahtn.png",
            });

            console.log("✅ Cancelamento processado com sucesso para usuário:", user.email);
          } else {
            console.log("⚠️ Usuário não encontrado para cancelamento:", {
              stripeCustomerId,
              customerEmail,
              subscriptionId
            });
          }
        } catch (dbError) {
          console.error("❌ Erro no banco ao processar cancelamento:", dbError);
          // Don't break the webhook - continue processing
        }
        break;

      case "customer.subscription.updated":
        console.log("🔄 Assinatura atualizada:", event.data.object.id, JSON.stringify(event.data.object));
        
        try {
          const subscription = event.data.object as Stripe.Subscription;
          
          // Extract subscription and customer data
          const stripeCustomerId = subscription.customer as string;
          const subscriptionId = subscription.id;
          const updatedAt = new Date(subscription.created * 1000);
          
          // Extract plan details from the first subscription item
          const subscriptionItem = subscription.items.data[0];
          const plan = subscriptionItem?.plan;
          const price = subscriptionItem?.price;
          
          // Extract pricing information
          const newAmount = plan?.amount || price?.unit_amount || 0;
          const currency = subscription.currency || "brl";
          const priceId = plan?.id || price?.id || "unknown";
          const productId = typeof (plan?.product) === "string" ? plan.product : 
                           typeof (price?.product) === "string" ? price.product : "unknown";
          
          // Extract metadata and plan details
          const customerEmail = subscription.metadata?.customer_email || "unknown";
          
          // Get plan name and type from priceId mapping (more reliable than metadata)
          const planDetails = getPlanDetailsByPriceId(priceId);
          const planName = planDetails.planName;
          const planType = planDetails.planType;
          
          // Extract billing period
          const currentPeriodStart = new Date(subscriptionItem?.current_period_start * 1000);
          const currentPeriodEnd = new Date(subscriptionItem?.current_period_end * 1000);
          
          console.log("🔍 Dados da atualização de assinatura:", {
            stripeCustomerId,
            subscriptionId,
            customerEmail,
            planName,
            planType,
            newAmount: newAmount / 100, // Convert cents to reais
            currency,
            priceId,
            productId,
            currentPeriodStart: currentPeriodStart.toISOString(),
            currentPeriodEnd: currentPeriodEnd.toISOString(),
            updatedAt: updatedAt.toISOString(),
            planDetailsMapping: `priceId "${priceId}" -> planName "${planName}", planType "${planType}"`
          });

          // Find existing user by stripeCustomerId first, then by email
          let user = await prisma.user.findUnique({
            where: { stripeCustomerId },
          });

          if (!user && customerEmail !== "unknown") {
            // If not found by stripeCustomerId, check by email
            user = await prisma.user.findUnique({
              where: { email: customerEmail },
            });
          }

          if (user) {
            // Get previous plan details for comparison
            const previousAmount = user.amount || 0;
            const previousPlanName = user.planName || "unknown";
            
            // Determine if this is an upgrade, downgrade, or same price change
            const amountInReais = newAmount / 100;
            const previousAmountInReais = previousAmount;
            
            let changeType = "modification";
            if (amountInReais > previousAmountInReais) {
              changeType = "upgrade";
            } else if (amountInReais < previousAmountInReais) {
              changeType = "downgrade";
            }

            console.log("📊 Análise da mudança de plano:", {
              userId: user.id,
              email: user.email,
              previousPlan: previousPlanName,
              newPlan: planName,
              previousAmount: previousAmountInReais,
              newAmount: amountInReais,
              changeType
            });

            // Update user with new subscription details
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionId,
                planName,
                planType,
                priceId,
                productId,
                currency,
                amount: amountInReais,
                subscriptionStart: currentPeriodStart,
                subscriptionEnd: currentPeriodEnd,
                invoiceStatus: subscription.status || "active",
                updatedAt: new Date(),
              },
            });

            console.log("👤 Usuário atualizado após mudança de plano:", {
              userId: updatedUser.id,
              email: updatedUser.email,
              name: updatedUser.name,
              newPlan: updatedUser.planName,
              newAmount: updatedUser.amount,
              subscriptionEnd: updatedUser.subscriptionEnd?.toISOString()
            });

            // Create payment record for subscription change tracking
            await prisma.payment.create({
              data: {
                id: `${event.id}_update`, // Unique ID for update event
                status: "completed",
                amount: amountInReais,
                currency: currency,
                invoiceUrl: "", // Will be updated when invoice webhook arrives
                invoicePdf: "", // Will be updated when invoice webhook arrives
                invoiceStatus: subscription.status || "active",
                userId: user.id,
              },
            });

            console.log("💾 Registro de atualização de assinatura salvo:", event.id);

            // Send subscription change notification email
            await sendSubscriptionChangeEmail({
              customerName: user.name,
              customerEmail: user.email,
              previousPlan: previousPlanName,
              newPlan: planName,
              previousAmount: previousAmountInReais,
              newAmount: amountInReais,
              changeType: changeType,
              effectiveDate: currentPeriodStart,
              companyName: "Team Travagli",
              companyLogoUrl: "https://landing-pagee-one.vercel.app/assets/logo_team_travagli-DD5cahtn.png",
            });

            console.log(`✅ Atualização de assinatura processada com sucesso (${changeType}):`, {
              userEmail: user.email,
              change: `${previousPlanName} → ${planName}`,
              priceChange: `R$ ${previousAmountInReais} → R$ ${amountInReais}`
            });
          } else {
            console.log("⚠️ Usuário não encontrado para atualização de assinatura:", {
              stripeCustomerId,
              customerEmail,
              subscriptionId
            });
          }
        } catch (dbError) {
          console.error("❌ Erro no banco ao processar atualização de assinatura:", dbError);
          // Don't break the webhook - continue processing
        }
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
