export const SHIPPING_PROVIDER = "Fastway Couriers"
export const SHIPPING_PER_BEANBAG_CENTS = 25000 // R250.00 per pool beanbag
export const SHIPPING_PER_LOUNGER_CENTS = 100000 // R1000.00 per super lounger

// Legacy exports for backwards compatibility
export const SHIPPING_FLAT_CENTS = 25000
export const SHIPPING_LOUNGER_CENTS = 100000

// Calculate shipping based on items in cart
export function calculateShipping(items: { title: string; quantity: number }[]): number {
  let totalShipping = 0;
  
  for (const item of items) {
    const isLounger = item.title.toLowerCase().includes('lounger');
    const perItemRate = isLounger ? SHIPPING_PER_LOUNGER_CENTS : SHIPPING_PER_BEANBAG_CENTS;
    totalShipping += perItemRate * item.quantity;
  }
  
  return totalShipping;
}