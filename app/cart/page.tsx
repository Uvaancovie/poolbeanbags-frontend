"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../components/CartContext';
import { Button } from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toFixed(2)}`;
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-4xl font-bold text-base-content mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-base-content/70 mb-8">Add some pool beanbags to get started!</p>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 bg-gradient-to-r from-blue-600 to-pink-500 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg flex items-center gap-3">
            🛒 Shopping Cart
          </h1>
          <p className="text-xl text-white/90 font-medium">Review your items and proceed to checkout ✨</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-2xl border-t-8 border-blue-600 bg-white rounded-2xl">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-base-300 rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-base-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🏊
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-base-content">
                        <Link href={`/product/${item.slug}`} className="hover:text-primary">
                          {item.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-base-content/70">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-sm btn-ghost"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-sm btn-ghost"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold text-base-content">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="btn btn-sm btn-ghost text-error hover:bg-error hover:text-error-content"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-base-300">
                <button
                  onClick={clearCart}
                  className="btn btn-sm btn-outline btn-error"
                >
                  Clear Cart
                </button>
              </div>
            </Card>
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
                className="w-full bg-primary hover:bg-primary-focus text-primary-content font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
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
    </div>
  );
}