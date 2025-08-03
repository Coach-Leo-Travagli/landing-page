// Centralized plan configuration for the entire application
// This file contains all plan-related data and should be the single source of truth

export type PlanType = 'basic' | 'standard' | 'vip';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanConfig {
  id: PlanType;
  name: string;
  shortName: string;
  price: number;
  priceFormatted: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  variant: 'outline' | 'hero' | 'cta' | 'default';
  priceId: string;
  stripePriceId: string; // For backend usage
}

// Environment variable getters with fallbacks
const getBasicPriceId = (): string => {
  return import.meta.env.VITE_STRIPE_PRICE_BASIC_ID || 'basic_monthly';
};

const getStandardPriceId = (): string => {
  return import.meta.env.VITE_STRIPE_PRICE_STANDARD_ID || 'standard_monthly';
};

const getVipPriceId = (): string => {
  return import.meta.env.VITE_STRIPE_PRICE_VIP_ID || 'vip_monthly';
};

// Master plan configuration
export const PLANS: Record<PlanType, PlanConfig> = {
  basic: {
    id: 'basic',
    name: 'Plano Básico',
    shortName: 'Básico',
    price: 129,
    priceFormatted: 'R$ 129',
    period: '/mês',
    description: 'Perfeito para iniciantes que estão começando sua jornada fitness',
    features: [
      'Planos de treino personalizados',
      'Biblioteca de vídeos de exercícios',
      'Acompanhamento de progresso',
      'Diretrizes básicas de nutrição',
      'Suporte por email'
    ],
    popular: false,
    variant: 'outline',
    priceId: getBasicPriceId(),
    stripePriceId: getBasicPriceId(),
  },
  standard: {
    id: 'standard',
    name: 'Plano Padrão',
    shortName: 'Padrão',
    price: 199,
    priceFormatted: 'R$ 199',
    period: '/mês',
    description: 'Escolha mais popular para transformações sérias',
    features: [
      'Tudo do plano Básico',
      'Planos de refeições personalizados',
      'Recomendações de suplementos',
      'Check-ins semanais de progresso',
      'Suporte prioritário por chat',
      'Acesso ao banco de receitas'
    ],
    popular: true,
    variant: 'hero',
    priceId: getStandardPriceId(),
    stripePriceId: getStandardPriceId(),
  },
  vip: {
    id: 'vip',
    name: 'Plano VIP',
    shortName: 'VIP',
    price: 399,
    priceFormatted: 'R$ 399',
    period: '/mês',
    description: 'Coaching premium com resultados máximos',
    features: [
      'Tudo do plano Padrão',
      'Videochamadas 1-a-1 (2x/mês)',
      'Suporte 24/7 do personal trainer',
      'Planejamento de meal prep',
      'Análise de composição corporal',
      'Ajustes prioritários no plano',
      'Acesso à comunidade exclusiva'
    ],
    popular: false,
    variant: 'cta',
    priceId: getVipPriceId(),
    stripePriceId: getVipPriceId(),
  },
};

// Helper functions for different use cases
export const getAllPlans = (): PlanConfig[] => Object.values(PLANS);

export const getPlan = (planType: PlanType): PlanConfig => PLANS[planType];

export const getPlanByKey = (key: string): PlanConfig | undefined => {
  const planType = key as PlanType;
  return PLANS[planType];
};

export const getPopularPlan = (): PlanConfig => {
  return getAllPlans().find(plan => plan.popular) || PLANS.standard;
};

export const isValidPlanType = (planType: string): planType is PlanType => {
  return Object.keys(PLANS).includes(planType);
};

// For Pricing component compatibility
export const getPlansForPricingComponent = () => {
  return getAllPlans().map(plan => ({
    name: plan.shortName,
    price: plan.priceFormatted,
    priceValue: plan.price,
    period: plan.period,
    description: plan.description,
    features: plan.features,
    popular: plan.popular,
    variant: plan.variant,
    planType: plan.id,
  }));
};

// For API usage (simplified)
export const getPlansForAPI = () => {
  return Object.fromEntries(
    Object.entries(PLANS).map(([key, plan]) => [
      key,
      {
        name: plan.name,
        priceId: plan.stripePriceId,
      }
    ])
  );
};

// For Stripe payment page
export const getPlansForPaymentPage = () => {
  return Object.fromEntries(
    Object.entries(PLANS).map(([key, plan]) => [
      key,
      {
        name: plan.name,
        price: plan.price,
        features: plan.features,
      }
    ])
  );
};

// Price ID mappings for Stripe
export const STRIPE_PRICE_IDS: Record<PlanType, string> = {
  basic: getBasicPriceId(),
  standard: getStandardPriceId(),
  vip: getVipPriceId(),
};

export default PLANS;