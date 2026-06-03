/** Standard input length limits (HTML maxLength / validation). */
export const FIELD_LIMITS = {
  email: { max: 60 },
  password: { min: 6, max: 30 },
  name: { min: 2, max: 50 },
  phone: { min: 10, max: 10 },
  addressLine: { max: 200 },
  city: { max: 60 },
  state: { max: 60 },
  pincode: { min: 6, max: 6 },
  cardNumber: { min: 12, max: 19 },
} as const;
