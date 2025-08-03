// CommonJS version of plans configuration for API use
// This file bridges the gap between our TypeScript utils and API files

const getBasicPriceId = () => 
  process.env.STRIPE_PRICE_BASIC_ID || 'basic_monthly';

const getStandardPriceId = () => 
  process.env.STRIPE_PRICE_STANDARD_ID || 'standard_monthly';

const getVipPriceId = () => 
  process.env.STRIPE_PRICE_VIP_ID || 'vip_monthly';

const PLANS = {
  basic: {
    name: 'Plano Básico',
    priceId: getBasicPriceId(),
  },
  standard: {
    name: 'Plano Padrão',
    priceId: getStandardPriceId(),
  },
  vip: {
    name: 'Plano VIP',
    priceId: getVipPriceId(),
  },
};

const isValidPlanType = (planType) => {
  return Object.keys(PLANS).includes(planType);
};

module.exports = {
  PLANS,
  isValidPlanType,
};