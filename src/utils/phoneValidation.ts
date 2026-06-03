import { FIELD_LIMITS } from './fieldLimits';

export function normalizePhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, FIELD_LIMITS.phone.max);
}

export function validatePhone(value: string): string | undefined {
  const digits = normalizePhoneInput(value);
  if (!digits) return 'Phone number is required';
  if (digits.length !== FIELD_LIMITS.phone.max) {
    return `Phone must be exactly ${FIELD_LIMITS.phone.max} digits`;
  }
  return undefined;
}
