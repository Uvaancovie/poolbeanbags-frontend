"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../components/CartContext';
import OzowPayButton from '../../components/OzowPayButton';
import { SHIPPING_FLAT_CENTS, SHIPPING_PROVIDER } from '../../lib/pricing';

export default function CheckoutPage() {
  const { items, getSubtotalCents, getTotalCents, clearCart } = useCart();
  const router = useRouter();
  
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  useEffect(() => {
    // Check if form is complete
    const customerComplete = firstName && lastName && email && phone;
    const addressComplete = deliveryType === 'pickup' || (address1 && city && province && postalCode);
    setCanSubmit(!!customerComplete && !!addressComplete);
  }, [firstName, lastName, email, phone, address1, city, province, postalCode, deliveryType]);

  const subtotal_cents = items.reduce((t, i) => t + i.price * i.quantity, 0);
  const shipping_cents = deliveryType === 'pickup' ? 0 : (items.length ? 20000 : 0);
  const total_cents = subtotal_cents + shipping_cents;

  const formatPrice = (cents: number) => `R${(cents / 100).toFixed(2)}`;

  const payload = {
    items: items.map(item => ({
      productId: item.id,
      title: item.title,
      slug: item.slug || '',
      price: item.price,
      quantity: item.quantity,
      image: item.image || ''
    })),
    subtotal_cents,
    shipping_cents,
    total_cents,
    customer: {
      first_name: firstName,
      last_name: lastName,
      email_address: email
    },
    shipping: {
      type: deliveryType,
      phone,
      address1,
      address2,
      city,
      province,
      postalCode
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="poppins-light text-[32px] mb-8 text-[var(--fg)]">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Customer info and shipping */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h2 className="poppins-regular text-lg mb-4 text-[var(--fg)]">Customer Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>

            {/* Delivery Method */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h2 className="poppins-regular text-lg mb-4 text-[var(--fg)]">Delivery Method</h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryType === 'delivery'}
                    onChange={() => setDeliveryType('delivery')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-[var(--fg)]">Delivery - {formatPrice(20000)}</p>
                    <p className="text-sm text-[var(--fg-muted)]">Nationwide delivery via {SHIPPING_PROVIDER}</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryType === 'pickup'}
                    onChange={() => setDeliveryType('pickup')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-[var(--fg)]">Pickup - Free</p>
                    <p className="text-sm text-[var(--fg-muted)]">Collect from 35A Ashley Avenue, Durban North</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Address (only for delivery) */}
            {deliveryType === 'delivery' && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="poppins-regular text-lg mb-4 text-[var(--fg)]">Delivery Address</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Province"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right column: Order summary */}
          <div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sticky top-8">
              <h2 className="poppins-regular text-lg mb-4 text-[var(--fg)]">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-[var(--fg)]">{item.title}</p>
                      <p className="text-[var(--fg-muted)]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[var(--fg)]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--fg-muted)]">Subtotal</span>
                  <span className="text-[var(--fg)]">{formatPrice(subtotal_cents)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--fg-muted)]">
                    Shipping {deliveryType === 'delivery' ? `(${SHIPPING_PROVIDER})` : '(Pickup)'}
                  </span>
                  <span className="text-[var(--fg)]">{formatPrice(shipping_cents)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-[var(--border)]">
                  <span className="text-[var(--fg)]">Total</span>
                  <span className="text-[var(--fg)]">{formatPrice(total_cents)}</span>
                </div>
              </div>

              <div className="mt-6">
                {canSubmit ? (
                  <OzowPayButton payload={payload} />
                ) : (
                  <button
                    disabled
                    className="w-full h-12 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--fg-muted)] cursor-not-allowed font-medium"
                  >
                    Complete form to continue
                  </button>
                )}
              </div>

              <p className="text-xs text-[var(--fg-muted)] text-center mt-4">
                Secure payment powered by Ozow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
