import { SUPPORT_PHONE_NUMBER } from './constants';

export function formatPhoneNumber(raw: string = SUPPORT_PHONE_NUMBER): string {
  // Expect Brazilian 11-digit number like 11999999999
  const onlyDigits = (raw || '').replace(/\D/g, '');
  if (onlyDigits.length !== 11) return raw;
  const ddd = onlyDigits.slice(0, 2);
  const first = onlyDigits.slice(2, 7);
  const last = onlyDigits.slice(7);
  return `+55 (${ddd}) ${first}-${last}`;
}

export function buildWhatsAppLink(message: string = 'Oi', raw: string = SUPPORT_PHONE_NUMBER): string {
  const onlyDigits = (raw || '').replace(/\D/g, '');
  return `https://wa.me/55${onlyDigits}?text=${encodeURIComponent(message)}`;
}
