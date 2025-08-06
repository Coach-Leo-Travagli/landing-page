import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  customerName: string;
  customerEmail: string;
  companyName: string;
  companyLogoUrl: string;
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
  return template
    .replace(/\{\{customerName\}\}/g, data.customerName)
    .replace(/\{\{customerEmail\}\}/g, data.customerEmail)
    .replace(/\{\{companyName\}\}/g, data.companyName)
    .replace(/\{\{companyLogoUrl\}\}/g, data.companyLogoUrl);
}

export async function sendWelcomeEmail(data: EmailData): Promise<void> {
  try {
    const template = loadEmailTemplate('welcome');
    const html = replaceTemplateVariables(template, data);
    
    const emailData = {
      from: 'Coach Leo <noreply@coachtravagli.com>',
      to: [data.customerEmail],
      subject: '🎉 Bem-vindo(a) à sua transformação fitness!',
      html,
    };

    const result = await resend.emails.send(emailData);

    console.log('📧 Resend response:', result);

    if (result.error) {
      console.error('❌ Resend API error:', result.error);
    } else if (result.data) {
      console.log('✅ Welcome email sent successfully:', result.data.id);
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
}

export async function sendPaymentFailedEmail(data: EmailData): Promise<void> {
  try {
    const template = loadEmailTemplate('payment_failed');
    const html = replaceTemplateVariables(template, data);
    
    const emailData = {
      from: 'Coach Leo <noreply@coachtravagli.com>',
      to: [data.customerEmail],
      subject: '⚠️ Houve um problema com seu pagamento',
      html,
    };

    const result = await resend.emails.send(emailData);
    console.log('✅ Payment failed email sent successfully:', result.data?.id);
  } catch (error) {
    console.error('❌ Error sending payment failed email:', error);
    // Don't throw - we don't want to break the webhook
  }
} 