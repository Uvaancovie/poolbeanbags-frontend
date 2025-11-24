"use client"

import { useState } from "react"
import { useCart } from "@/components/CartContext"
import { Button } from "@/components/ui/Button"
import Card from "@/components/ui/Card"

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
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000) // Hide after 3 seconds
  }

  return (
    <>
      <Button
        onClick={handleAddToCart}
        className="w-full sm:w-auto btn-primary px-6 py-3 rounded-lg"
      >
        Add to Cart
      </Button>
      {showSuccess && (
        <Card className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 border-none">
          Added to cart!
        </Card>
      )}
    </>
  )
}