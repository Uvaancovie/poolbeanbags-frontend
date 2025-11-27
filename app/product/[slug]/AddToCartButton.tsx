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
  const [selectedFabric, setSelectedFabric] = useState<string>("Black Stripe")

  const FABRICS = [
    "Black Stripe", "Navy Stripe", "Yellow Stripe", "Red Stripe",
    "Delicious Monster on Black",
    "Delicious Monster Blue", "Blue Palms", "Protea",
    "Watermelon", "Cycadelic"
  ];

  const handleAddToCart = () => {
    addItem(product, 1, selectedFabric)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000) // Hide after 3 seconds
  }

  return (
    <div className="flex flex-col gap-4 w-full sm:w-auto">
      <div>
        <label className="block text-sm font-medium text-[var(--fg)] mb-2">
          Select Fabric
        </label>
        <select
          value={selectedFabric}
          onChange={(e) => setSelectedFabric(e.target.value)}
          className="input w-full sm:w-64"
        >
          {FABRICS.map(fabric => (
            <option key={fabric} value={fabric}>{fabric}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleAddToCart}
          className="w-full sm:w-auto btn-primary px-6 py-3 rounded-lg"
        >
          Add to Cart
        </Button>
      </div>

      {showSuccess && (
        <Card className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 border-none">
          Added to cart!
        </Card>
      )}
    </div>
  )
}