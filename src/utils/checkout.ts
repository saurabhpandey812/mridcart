export const DELIVERY_FEE = 49;
export const FREE_DELIVERY_MIN = 999;

export function calcDeliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
}
