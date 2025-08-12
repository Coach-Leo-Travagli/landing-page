import { SUPPORT_EMAIL } from './constants';

export function getSupportEmail(): string {
  return SUPPORT_EMAIL;
}

export function buildMailTo(subject?: string, body?: string, email: string = SUPPORT_EMAIL): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ''}`;
}
