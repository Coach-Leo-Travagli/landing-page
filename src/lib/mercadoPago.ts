/**
 * Mercado Pago Subscription Integration
 * 
 * This file implements Mercado Pago subscriptions using the official preapproval plan approach.
 * 
 * Flow:
 * 1. Create a preapproval plan (/preapproval_plan)
 * 2. Tokenize customer's card 
 * 3. Create subscription (/preapproval) with plan ID and card token
 * 
 * Environment Variables Required:
 * - VITE_MERCADO_PAGO_PUBLIC_KEY: Your Mercado Pago public key (starts with TEST- for sandbox)
 * - VITE_MERCADO_PAGO_ACCESS_TOKEN: Your Mercado Pago access token (starts with TEST- for sandbox)
 * - VITE_MERCADO_PAGO_ENV: Environment ('sandbox' or 'production')
 * - VITE_APP_BASE_URL: Your application's base URL for redirects
 * 
 * References:
 * - https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration-configuration/subscription-associated-plan
 */

import { initMercadoPago } from '@mercadopago/sdk-react';

// Environment variables
const PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;
const MP_ENV = import.meta.env.VITE_MERCADO_PAGO_ENV || 'sandbox';
const BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173';

// ================================
// PLAN CONFIGURATION
// ================================
// TODO: Replace these with your actual plan IDs after creating them with CURL
const PLAN_IDS = {
  'Básico': 'YOUR_BASIC_PLAN_ID_HERE',     // R$ 129/month
  'Padrão': 'YOUR_STANDARD_PLAN_ID_HERE',  // R$ 199/month  
  'VIP': 'YOUR_VIP_PLAN_ID_HERE',          // R$ 399/month
  'Test Plan': 'YOUR_TEST_PLAN_ID_HERE',   // For testing
} as const;

/**
 * Get plan ID for a given plan name
 */
export function getPlanId(planName: string): string {
  const planId = PLAN_IDS[planName as keyof typeof PLAN_IDS];
  if (!planId || planId.includes('YOUR_') || planId.includes('_HERE')) {
    throw new Error(`Plan ID not configured for "${planName}". Please create the plan first using CURL and update PLAN_IDS in mercadoPago.ts`);
  }
  return planId;
}

// Initialize Mercado Pago SDK
if (!PUBLIC_KEY) {
  console.error('VITE_MERCADO_PAGO_PUBLIC_KEY is not defined in environment variables');
} else {
  initMercadoPago(PUBLIC_KEY);
}

// ================================
// TYPES
// ================================

export interface PreapprovalPlan {
  id?: string;
  reason: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'days' | 'weeks' | 'months';
    repetitions?: number;
    billing_day?: number;
    billing_day_proportional?: boolean;
    free_trial?: {
      frequency: number;
      frequency_type: 'days' | 'weeks' | 'months';
    };
    transaction_amount: number;
    currency_id: string;
  };
  payment_methods_allowed?: {
    payment_types?: Array<Record<string, unknown>>;
    payment_methods?: Array<Record<string, unknown>>;
  };
  back_url?: string;
}

export interface PreapprovalSubscription {
  id?: string;
  preapproval_plan_id: string;
  reason: string;
  external_reference?: string;
  payer_email: string;
  card_token_id: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'days' | 'weeks' | 'months';
    start_date: string;
    end_date?: string;
    transaction_amount: number;
    currency_id: string;
  };
  back_url?: string;
  status: 'authorized' | 'pending' | 'cancelled';
}

export interface CardToken {
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  cardholderName: string;
  identificationType?: string;
  identificationNumber?: string;
}

// ================================
// STEP 1: CREATE PREAPPROVAL PLAN
// ================================

/**
 * Creates a preapproval plan for subscriptions
 * This defines the recurring payment structure (frequency, amount, etc.)
 */
export async function createPreapprovalPlan(
  planName: string,
  monthlyAmount: number,
  options: {
    frequency?: number;
    frequencyType?: 'days' | 'weeks' | 'months';
    repetitions?: number;
    billingDay?: number;
    freeTrial?: {
      frequency: number;
      frequencyType: 'days' | 'weeks' | 'months';
    };
  } = {}
): Promise<PreapprovalPlan> {
  const {
    frequency = 1,
    frequencyType = 'months',
    repetitions = 12,
    billingDay = 10,
    freeTrial
  } = options;

  const plan: PreapprovalPlan = {
    reason: planName,
    auto_recurring: {
      frequency,
      frequency_type: frequencyType,
      repetitions,
      billing_day: billingDay,
      billing_day_proportional: true,
      transaction_amount: monthlyAmount,
      currency_id: 'BRL',
      ...(freeTrial && {
        free_trial: {
          frequency: freeTrial.frequency,
          frequency_type: freeTrial.frequencyType,
        },
      }),
    },
    payment_methods_allowed: {
      payment_types: [{}],
      payment_methods: [{}],
    },
    back_url: `${BASE_URL}/subscription/success`,
  };

  // Log CURL command for manual execution (plans should be created once on backend)
  console.log('📋 COPY THIS CURL COMMAND TO CREATE THE PLAN:');
  console.log('===============================================');
  
  const curlCommand = `curl -X POST \\
  'https://api.mercadopago.com/preapproval_plan' \\
  -H 'Authorization: Bearer ${ACCESS_TOKEN}' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(plan, null, 2)}'`;
  
  console.log(curlCommand);
  console.log('===============================================');
  console.log('💡 TIP: Run this in your terminal, then copy the returned "id" for subscriptions');
  
  // For now, throw an error to prevent frontend API calls
  throw new Error('CORS Error: Plans should be created on backend. Use the CURL command above!');
}

// ================================
// STEP 2: CREATE CARD TOKEN
// ================================

/**
 * Creates a card token using Mercado Pago SDK
 * This securely tokenizes the customer's card information
 */
export async function createCardToken(cardData: CardToken): Promise<string> {
  console.log('🔒 Creating card token...');

  try {
    // Import the SDK function
    const { createCardToken: sdkCreateCardToken } = await import('@mercadopago/sdk-react');
    
    // Convert our interface to SDK format
    const sdkCardData = {
      cardNumber: cardData.cardNumber,
      expirationMonth: cardData.expirationMonth,
      expirationYear: cardData.expirationYear,
      securityCode: cardData.securityCode,
      cardholderName: cardData.cardholderName,
      ...(cardData.identificationType && cardData.identificationNumber && {
        identificationType: cardData.identificationType,
        identificationNumber: cardData.identificationNumber,
      }),
    };
    
    console.log('🔧 Tokenizing card with data:', {
      ...sdkCardData,
      cardNumber: sdkCardData.cardNumber.replace(/\d(?=\d{4})/g, '*'),
      securityCode: '***',
    });
    
    const token = await sdkCreateCardToken(sdkCardData);
    
    if (!token || !token.id) {
      throw new Error('Failed to create card token');
    }

    console.log('✅ Card token created:', token.id);
    return token.id;
  } catch (error) {
    console.error('❌ Card token creation failed:', error);
    throw error;
  }
}

// ================================
// STEP 3: CREATE SUBSCRIPTION
// ================================

/**
 * Creates a subscription using a preapproval plan and card token
 */
export async function createSubscription(
  planId: string,
  cardTokenId: string,
  customerEmail: string,
  options: {
    externalReference?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}
): Promise<PreapprovalSubscription> {
  const { externalReference, startDate, endDate } = options;

  // Calculate dates
  const start = startDate || new Date();
  const end = endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

  const subscription: Omit<PreapprovalSubscription, 'id'> = {
    preapproval_plan_id: planId,
    reason: 'Subscription to coaching plan',
    external_reference: externalReference || `sub_${Date.now()}`,
    payer_email: customerEmail,
    card_token_id: cardTokenId,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months',
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      transaction_amount: 0, // Will be taken from the plan
      currency_id: 'BRL',
    },
    back_url: `${BASE_URL}/subscription/success`,
    status: 'authorized',
  };

  console.log('📝 Creating subscription:', subscription);

  try {
    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Subscription creation failed:', errorData);
      throw new Error(`Subscription creation failed: ${JSON.stringify(errorData)}`);
    }

    const createdSubscription = await response.json();
    console.log('✅ Subscription created successfully:', createdSubscription.id);
    return createdSubscription;
  } catch (error) {
    console.error('💥 Subscription creation error:', error);
    throw error;
  }
}

// ================================
// ORCHESTRATION FUNCTION
// ================================

/**
 * Create subscription using existing plan ID (recommended approach)
 */
export async function createSubscriptionWithPlan(
  planId: string,
  cardData: CardToken,
  customerEmail: string,
  options: {
    externalReference?: string;
  } = {}
): Promise<PreapprovalSubscription> {
  console.log('🚀 Starting subscription creation with existing plan...');

  try {
    // Step 1: Create card token
    const cardToken = await createCardToken(cardData);

    // Step 2: Create subscription with existing plan
    const subscription = await createSubscription(
      planId,
      cardToken,
      customerEmail,
      {
        externalReference: options.externalReference,
      }
    );

    console.log('🎉 Subscription created successfully!');
    return subscription;
  } catch (error) {
    console.error('💥 Subscription creation failed:', error);
    throw error;
  }
}

/**
 * Complete subscription flow: creates plan, tokenizes card, creates subscription
 * NOTE: This will show CURL command for plan creation instead of calling API
 */
export async function createCompleteSubscription(
  planName: string,
  monthlyAmount: number,
  cardData: CardToken,
  customerEmail: string,
  options: {
    frequency?: number;
    frequencyType?: 'days' | 'weeks' | 'months';
    repetitions?: number;
    externalReference?: string;
  } = {}
): Promise<{
  plan: PreapprovalPlan;
  subscription: PreapprovalSubscription;
}> {
  console.log('🚀 Starting complete subscription flow...');

  try {
    // Step 1: Create plan (will show CURL command)
    const plan = await createPreapprovalPlan(planName, monthlyAmount, options);

    // This won't be reached due to CORS error above, but kept for reference
    const cardToken = await createCardToken(cardData);
    const subscription = await createSubscription(
      plan.id!,
      cardToken,
      customerEmail,
      {
        externalReference: options.externalReference,
      }
    );

    console.log('🎉 Complete subscription flow successful!');
    return { plan, subscription };
  } catch (error) {
    console.error('💥 Complete subscription flow failed:', error);
    throw error;
  }
}

// ================================
// VALIDATION
// ================================

/**
 * Validates Mercado Pago configuration
 */
export function validateConfiguration(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!PUBLIC_KEY) {
    errors.push('VITE_MERCADO_PAGO_PUBLIC_KEY is not defined');
  }

  if (!ACCESS_TOKEN) {
    errors.push('VITE_MERCADO_PAGO_ACCESS_TOKEN is not defined');
  }

  if (!BASE_URL) {
    errors.push('VITE_APP_BASE_URL is not defined');
  }

  // Check credential consistency
  const isPublicKeySandbox = PUBLIC_KEY?.startsWith('TEST-') || false;
  const isAccessTokenSandbox = ACCESS_TOKEN?.startsWith('TEST-') || false;

  if (MP_ENV === 'sandbox') {
    warnings.push('Using sandbox environment - not suitable for production');
    
    if (!isPublicKeySandbox) {
      errors.push('Environment is sandbox but PUBLIC_KEY appears to be production');
    }
    
    if (!isAccessTokenSandbox) {
      errors.push('Environment is sandbox but ACCESS_TOKEN appears to be production');
    }
  }

  if (isPublicKeySandbox !== isAccessTokenSandbox) {
    errors.push('PUBLIC_KEY and ACCESS_TOKEN are from different environments');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ================================
// DEBUGGING
// ================================

/**
 * Debug function to display environment information
 */
export function debugEnvironment(): void {
  console.log('🔧 MERCADO PAGO ENVIRONMENT DEBUG');
  console.log('================================');
  console.log('Environment:', MP_ENV);
  console.log('Base URL:', BASE_URL);
  console.log('Public Key Type:', PUBLIC_KEY?.startsWith('TEST-') ? 'SANDBOX' : 'PRODUCTION');
  console.log('Access Token Type:', ACCESS_TOKEN?.startsWith('TEST-') ? 'SANDBOX' : 'PRODUCTION');
  
  const validation = validateConfiguration();
  console.log('\n📊 VALIDATION:');
  console.log('Valid:', validation.isValid);
  if (validation.errors.length > 0) {
    console.log('❌ Errors:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.log('⚠️ Warnings:', validation.warnings);
  }
}

// Export configuration for debugging
export const config = {
  hasPublicKey: !!PUBLIC_KEY,
  hasAccessToken: !!ACCESS_TOKEN,
  environment: MP_ENV,
  baseUrl: BASE_URL,
} as const;