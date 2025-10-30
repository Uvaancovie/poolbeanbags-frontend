"use client"

import { useCart } from "@/components/CartContext"
import { Button } from "@/components/ui/Button"

type Product = {
  _id?: string
  id: string
  slug: string
  title: string
  description?: string
  base_price_cents?: number
  images?: { _id?: string; id?: string; url: string; alt?: string }[]
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  return (
    <Button
      onClick={() => addItem(product)}
      className="w-full sm:w-auto btn-primary px-6 py-3 rounded-lg"
    >
      Add to Cart
    </Button>
  )
}