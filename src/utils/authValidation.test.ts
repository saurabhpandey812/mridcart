import {
  validateEmail,
  validateLoginForm,
  validateName,
  validatePassword,
  validateSignupForm,
} from './authValidation';

describe('authValidation', () => {
  it('rejects invalid email', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail('bad')).toBe('Enter a valid email address');
    expect(validateEmail('user@domain.com')).toBeUndefined();
    expect(validateEmail(`${'a'.repeat(55)}@test.com`)).toBe(
      'Email must be 60 characters or less'
    );
  });

  it('rejects weak password', () => {
    expect(validatePassword('')).toBe('Password is required');
    expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
    expect(validatePassword('pass word')).toBe('Password cannot contain spaces');
    expect(validatePassword('secret1')).toBeUndefined();
  });

  it('rejects invalid name', () => {
    expect(validateName('')).toBe('Name is required');
    expect(validateName('A')).toBe('Name must be at least 2 characters');
    expect(validateName('John123')).toMatch(/letters/);
    expect(validateName('Jane Doe')).toBeUndefined();
  });

  it('validates full login and signup forms', () => {
    expect(validateLoginForm({ email: '', password: '' })).toEqual({
      email: 'Email is required',
      password: 'Password is required',
    });
    expect(
      validateSignupForm({ name: 'Jane', email: 'j@x.com', password: 'abc123' })
    ).toEqual({});
  });
});
