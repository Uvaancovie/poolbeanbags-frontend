"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../components/CartContext';
import { Button } from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { SHIPPING_FLAT_CENTS, SHIPPING_PROVIDER } from '../../lib/pricing';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart, getSubtotalCents, getTotalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toFixed(2)}`;
  };

  const subtotal = getSubtotalCents();
  const shipping = items.length > 0 ? SHIPPING_FLAT_CENTS : 0;
  const total = getTotalCents();

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
        <Card className="max-w-lg w-full p-10 text-center border border-[var(--border)] bg-[var(--card)] rounded-2xl">
          <h1 className="poppins-light text-2xl text-[var(--fg)] mb-2">Your cart is empty</h1>
          <p className="text-[var(--fg-muted)] mb-6">Add some pool beanbags to get started!</p>
          <Link href="/shop" className="btn-outline rounded-full px-5 py-2">Continue Shopping</Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="bg-[var(--bg)] min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="mb-8">
          <h1 className="poppins-light text-[32px] md:text-[40px] text-[var(--fg)]">Shopping Cart</h1>
          <p className="text-[var(--fg-muted)] mt-2">Review your items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-6 border border-[var(--border)] bg-[var(--card)] rounded-2xl">
                <div className="flex gap-4">
                  {item.image && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="poppins-regular text-[var(--fg)] text-lg mb-1">{item.title}</h3>
                    <p className="text-[var(--fg-muted)] text-sm mb-3">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--fg)] hover:bg-[var(--muted)]"
                        >
                          -
                        </button>
                        <span className="text-[var(--fg)] min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--fg)] hover:bg-[var(--muted)]"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[var(--fg-muted)] hover:text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={clearCart}
                className="text-[var(--fg-muted)] hover:text-red-500 text-sm"
              >
                Clear Cart
              </button>
              <Link href="/shop" className="text-[var(--fg)] hover:opacity-80 text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm sticky top-24">
              <h2 className="text-xl font-semibold text-base-content mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>{formatPrice(getTotal() * 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>TBD</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>TBD</span>
                </div>
              </div>

              <div className="border-t border-base-300 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(getTotal() * 100)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary-focus text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </Button>

              <div className="mt-4 text-center">
                <Link href="/shop" className="text-sm text-base-content/70 hover:text-primary">
                  Continue Shopping
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}