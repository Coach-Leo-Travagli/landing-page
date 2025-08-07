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
  originalPrice: number;
  priceFormatted: string;
  originalPriceFormatted: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  variant: 'outline' | 'hero' | 'cta' | 'default';
  priceId: string;
  stripePriceId: string; // For backend usage
  isPromo: boolean;
  promoLabel: string;
  discountPercentage: number;
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
    price: 97,
    originalPrice: 129,
    priceFormatted: 'R$ 97',
    originalPriceFormatted: 'R$ 129',
    period: '/mês',
    description: 'Ideal para quem está começando a treinar com orientação profissional',
    features: [
      'Planos de treino personalizados',
      'Vídeos demonstrativos dos exercícios',
      'Acompanhamento do progresso',
      'Diretrizes básicas de nutrição',
      'Suporte por email'
    ],
    popular: false,
    variant: 'outline',
    priceId: getBasicPriceId(),
    stripePriceId: getBasicPriceId(),
    isPromo: true,
    promoLabel: 'Preço Especial de Lançamento',
    discountPercentage: 25,
  },
  standard: {
    id: 'standard',
    name: 'Plano Padrão',
    shortName: 'Padrão',
    price: 147,
    originalPrice: 199,
    priceFormatted: 'R$ 147',
    originalPriceFormatted: 'R$ 199',
    period: '/mês',
    description: 'Para quem quer personalização completa e acompanhamento mais próximo',
    features: [
      'Tudo do plano Básico',
      'Plano de refeições individualizado',
      'Recomendações de suplementos',
      'Check-ins semanais de progresso',
      'Suporte por whatsapp prioritário',
      'Acesso a receitas exclusivas'
    ],
    popular: true,
    variant: 'hero',
    priceId: getStandardPriceId(),
    stripePriceId: getStandardPriceId(),
    isPromo: true,
    promoLabel: 'Oferta Primeiros Inscritos',
    discountPercentage: 26,
  },
  vip: {
    id: 'vip',
    name: 'Plano VIP',
    shortName: 'VIP',
    price: 297,
    originalPrice: 399,
    priceFormatted: 'R$ 297',
    originalPriceFormatted: 'R$ 399',
    period: '/mês',
    description: 'Suporte premium com acompanhamento ainda mais próximo.',
    features: [
      'Tudo do plano Padrão',
      'Videochamadas 1-a-1 (2x/mês)',
      'Suporte 24/7 do personal trainer',
      'Ajustes prioritários no plano',
      'Análise detalhada de composição corporal',
      'Orientação para planejamento de refeições',
      'Acesso à comunidade exclusiva'
    ],
    popular: false,
    variant: 'cta',
    priceId: getVipPriceId(),
    stripePriceId: getVipPriceId(),
    isPromo: true,
    promoLabel: 'Desconto de Lançamento',
    discountPercentage: 30,
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
    originalPrice: plan.originalPriceFormatted,
    priceValue: plan.price,
    originalPriceValue: plan.originalPrice,
    period: plan.period,
    description: plan.description,
    features: plan.features,
    popular: plan.popular,
    variant: plan.variant,
    planType: plan.id,
    isPromo: plan.isPromo,
    promoLabel: plan.promoLabel,
    discountPercentage: plan.discountPercentage,
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