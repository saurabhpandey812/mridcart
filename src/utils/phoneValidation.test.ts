import { normalizePhoneInput, validatePhone } from './phoneValidation';

describe('phoneValidation', () => {
  it('normalizes to digits only', () => {
    expect(normalizePhoneInput('98 7654 3210')).toBe('9876543210');
    expect(normalizePhoneInput('98765432101234')).toBe('9876543210');
  });

  it('requires exactly 10 digits', () => {
    expect(validatePhone('')).toBe('Phone number is required');
    expect(validatePhone('98765')).toBe('Phone must be exactly 10 digits');
    expect(validatePhone('9876543210')).toBeUndefined();
  });
});
