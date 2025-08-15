import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';
import { htmlToText } from 'html-to-text';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  customerName: string;
  customerEmail: string;
  planName: string;
  companyName: string;
  companyLogoUrl: string;
  benefits?: string;
}

interface CancellationEmailData extends EmailData {
  planName: string;
  canceledAt: Date;
}

interface SubscriptionChangeEmailData extends EmailData {
  previousPlan: string;
  newPlan: string;
  previousAmount: number;
  newAmount: number;
  changeType: string; // "upgrade", "downgrade", "modification"
  effectiveDate: Date;
}

function loadEmailTemplate(templateName: string): string {
  try {
    const templatePath = join(process.cwd(), 'emails', `${templateName}.html`);
    return readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`❌ Error loading email template ${templateName}:`, error);
    throw new Error(`Failed to load email template: ${templateName}`);
  }
}

function replaceTemplateVariables(template: string, data: EmailData): string {
  let html = template
    .replace(/\{\{customerName\}\}/g, data.customerName)
    .replace(/\{\{customerEmail\}\}/g, data.customerEmail)
    .replace(/\{\{companyName\}\}/g, data.companyName)
    .replace(/\{\{planName\}\}/g, data.planName)
    .replace(/\{\{companyLogoUrl\}\}/g, data.companyLogoUrl);

  if (data.benefits) {
    html = html.replace(/\{\{benefits\}\}/g, data.benefits);
  }

  return html;
}

function replaceCancellationVariables(template: string, data: CancellationEmailData): string {
  return template
    .replace(/\{\{customerName\}\}/g, data.customerName)
    .replace(/\{\{customerEmail\}\}/g, data.customerEmail)
    .replace(/\{\{companyName\}\}/g, data.companyName)
    .replace(/\{\{companyLogoUrl\}\}/g, data.companyLogoUrl)
    .replace(/\{\{planName\}\}/g, data.planName)
    .replace(/\{\{canceledAt\}\}/g, data.canceledAt.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })) + ' (Horário de Brasília)';
}

function replaceSubscriptionChangeVariables(template: string, data: SubscriptionChangeEmailData): string {
  let html = template
    .replace(/\{\{customerName\}\}/g, data.customerName)
    .replace(/\{\{customerEmail\}\}/g, data.customerEmail)
    .replace(/\{\{companyName\}\}/g, data.companyName)
    .replace(/\{\{companyLogoUrl\}\}/g, data.companyLogoUrl)
    .replace(/\{\{previousPlan\}\}/g, data.previousPlan)
    .replace(/\{\{newPlan\}\}/g, data.newPlan)
    .replace(/\{\{previousAmount\}\}/g, data.previousAmount.toFixed(2))
    .replace(/\{\{newAmount\}\}/g, data.newAmount.toFixed(2))
    .replace(/\{\{changeType\}\}/g, data.changeType)
    .replace(/\{\{effectiveDate\}\}/g, data.effectiveDate.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })) + ' (Horário de Brasília)';

  if (data.benefits) {
    html = html.replace(/\{\{benefits\}\}/g, data.benefits);
  }

  return html;
}

export async function sendWelcomeEmail(data: EmailData): Promise<void> {
  try {
    let benefits = `
      <li>Iremos te chamar no Whatsapp para darmos início ao seu processo de transformação</li>
      <li>Você irá preencher um formulário para que possamos conhecer você melhor</li>
      <li>Você receberá um treino personalizado em alguns dias para você começar a treinar</li>
      <li>Iremos disponibilizar também um PDF com algumas diretrizes básicas de nutrição para você começar a se alimentar melhor</li>
      <li>Sua cobrança mensal será automática na data de hoje de cada mês</li>
    `;

    if (data.planName === 'Plano Padrão' || data.planName === 'Plano VIP') {
      benefits = `
        <li>O Coach Travagli entrará em contato para o onboarding personalizado</li>
        <li>Você irá preencher um formulário para que possamos conhecer você melhor</li>
        <li>Você receberá um treino e dieta personalizados em alguns dias para você começar a treinar</li>
        <li>Iremos disponibilizar também um PDF com algumas diretrizes básicas de nutrição para você começar a se alimentar melhor</li>
        <li>Sua cobrança mensal será automática na data de hoje de cada mês</li>
      `;
    }
    
    const template = loadEmailTemplate('welcome');
    const html = replaceTemplateVariables(template, {
      ...data,
      benefits,
    });
    const text = htmlToText(html) as string;
    
    await resend.emails.send({
      // from: 'Team Travagli <noreply@teamtravagli.com.br>',
      from: 'onboarding@resend.dev',
      to: data.customerEmail,
      subject: '🎉 Bem-vindo(a) à sua transformação fitness!',
      html,
      text,
    });

    console.log('✅ Welcome email sent successfully');
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
}

export async function sendPaymentFailedEmail(data: EmailData): Promise<void> {
  try {
    const template = loadEmailTemplate('payment_failed');
    const html = replaceTemplateVariables(template, data);
    const text = htmlToText(html) as string;
    
    await resend.emails.send({
      // from: 'Team Travagli <noreply@teamtravagli.com.br>',
      from: 'onboarding@resend.dev',
      to: data.customerEmail,
      subject: '⚠️ Houve um problema com seu pagamento',
      html,
      text,
    });

    console.log('✅ Payment failed email sent successfully');
  } catch (error) {
    console.error('❌ Error sending payment failed email:', error);
  }
}

export async function sendRenewalEmail(data: EmailData): Promise<void> {
  try {
    const template = loadEmailTemplate('renewal');
    const html = replaceTemplateVariables(template, data);
    const text = htmlToText(html) as string;

    await resend.emails.send({
      // from: 'Team Travagli <noreply@teamtravagli.com.br>',
      from: 'onboarding@resend.dev',
      to: data.customerEmail,
      subject: '🔁 Assinatura renovada com sucesso',
      html,
      text,
    });

    console.log('✅ Renewal email sent successfully');
  } catch (error) {
    console.error('❌ Error sending renewal email:', error);
  }
}

export async function sendCancellationEmail(data: CancellationEmailData): Promise<void> {
  try {
    const template = loadEmailTemplate('cancellation');
    const html = replaceCancellationVariables(template, data);
    const text = htmlToText(html) as string;

    await resend.emails.send({
      // from: 'Team Travagli <noreply@teamtravagli.com.br>',
      from: 'onboarding@resend.dev',
      to: data.customerEmail,
      subject: '😔 Assinatura cancelada - Sentiremos sua falta!',
      html,
      text,
    });

    console.log('✅ Cancellation email sent successfully');
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error);
  }
}

export async function sendSubscriptionChangeEmail(data: SubscriptionChangeEmailData): Promise<void> {
  try {
    let benefits = `
      <li>Treinos personalizados atualizados mensalmente</li>
      <li>Suporte via email</li>
      <li>Acompanhamento mensal de progresso</li>
    `;

    if (data.planName === 'Plano Padrão' || data.planName === 'Plano VIP') {
      benefits = `
        <li>Treinos personalizados atualizados quando necessário</li>
        <li>Plano alimentar adequado aos seus objetivos</li>
        <li>Suporte via whatsapp</li>
        <li>Acompanhamento semanal de progresso</li>
      `;
    }

    const template = loadEmailTemplate('subscription_change');
    const html = replaceSubscriptionChangeVariables(template, {
      ...data,
      benefits,
    });
    const text = htmlToText(html) as string;

    // Dynamic subject based on change type
    let subject = '🔄 Sua assinatura foi atualizada!';
    if (data.changeType === 'upgrade') {
      subject = '🚀 Upgrade realizado - Bem-vindo ao seu novo plano!';
    } else if (data.changeType === 'downgrade') {
      subject = '📋 Plano alterado - Confirmação da mudança';
    }

    await resend.emails.send({
      // from: 'Team Travagli <noreply@teamtravagli.com.br>',
      from: 'onboarding@resend.dev',
      to: data.customerEmail,
      subject,
      html,
      text,
    });

    console.log('✅ Subscription change email sent successfully');
  } catch (error) {
    console.error('❌ Error sending subscription change email:', error);
  }
}