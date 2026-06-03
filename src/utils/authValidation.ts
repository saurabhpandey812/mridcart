import { FIELD_LIMITS } from './fieldLimits';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[\p{L}\p{M}'\-\s.]+$/u;

const { email: EMAIL, password: PASSWORD, name: NAME } = FIELD_LIMITS;

export type AuthField = 'email' | 'password' | 'name';

export type AuthFieldErrors = Partial<Record<AuthField, string>>;

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues extends LoginFormValues {
  name: string;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'Email is required';
  if (trimmed.length > EMAIL.max) {
    return `Email must be ${EMAIL.max} characters or less`;
  }
  if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required';
  if (/\s/.test(value)) return 'Password cannot contain spaces';
  if (value.length < PASSWORD.min) {
    return `Password must be at least ${PASSWORD.min} characters`;
  }
  if (value.length > PASSWORD.max) {
    return `Password must be ${PASSWORD.max} characters or less`;
  }
  return undefined;
}

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 'Name is required';
  if (trimmed.length < NAME.min) {
    return `Name must be at least ${NAME.min} characters`;
  }
  if (trimmed.length > NAME.max) {
    return `Name must be ${NAME.max} characters or less`;
  }
  if (!NAME_REGEX.test(trimmed)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return undefined;
}

export function validateLoginForm(values: LoginFormValues): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function validateSignupForm(values: SignupFormValues): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const nameError = validateName(values.name);
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);
  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function validateAuthField(
  field: AuthField,
  values: SignupFormValues
): string | undefined {
  switch (field) {
    case 'name':
      return validateName(values.name);
    case 'email':
      return validateEmail(values.email);
    case 'password':
      return validatePassword(values.password);
    default:
      return undefined;
  }
}

export function hasAuthErrors(errors: AuthFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
