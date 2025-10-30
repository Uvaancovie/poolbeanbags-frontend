import { SHIPPING_FLAT_CENTS } from "@/lib/pricing"

export async function createOrderFromCart(items: any[]) {
  const subtotal_cents = items.reduce((t,i)=>t+i.price*i.quantity,0)
  const shipping_cents = items.length > 0 ? SHIPPING_FLAT_CENTS : 0
  const total_cents = subtotal_cents + shipping_cents

  const base = process.env.NEXT_PUBLIC_API_BASE ?? '';
  // Backend exposes POST /api/checkout (Express route). Use configured base or relative path fallback.
  const endpoint = base ? `${base.replace(/\/$/, '')}/api/checkout` : '/api/checkout';

  const res = await fetch(endpoint,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ items, subtotal_cents, shipping_cents, total_cents, courier: "Fastway" })
  })
  if(!res.ok) throw new Error("Failed to create order")
  return res.json()
}