"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../components/CartContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

interface CustomerInfo { firstName: string; lastName: string; email: string; phone: string }
interface ShippingAddress { addressLine1: string; addressLine2: string; city: string; state: string; postalCode: string; country: string }

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'shipping'>('pickup');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ firstName: '', lastName: '', email: '', phone: '' });
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({ addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'South Africa' });
  const [orderPlaced, setOrderPlaced] = useState<{ id: number; orderNo: string; deliveryMethod: string } | null>(null);

  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

  const formatPrice = (cents: number) => `R${(cents / 100).toFixed(2)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return router.push('/cart');
    setLoading(true);
    try {
      const payload: any = { items: items.map(i => ({ productId: i.productId, quantity: i.quantity })), deliveryMethod, customerInfo };
      if (deliveryMethod === 'pickup') {
        payload.pickupDate = pickupDate;
        payload.pickupTime = pickupTime;
      } else {
        payload.shippingAddress = shippingAddress;
      }

      const res = await fetch(`${API_BASE}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to create order');
      const data = await res.json();

      clearCart();
      setOrderPlaced({ id: data.order.id, orderNo: data.order.orderNo, deliveryMethod });
      setTimeout(() => router.push(`/order-confirmation?orderId=${data.order.id}`), 2200);
    } catch (err) {
      console.error('Order submission error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0 && !loading) router.push('/cart');
  }, [items, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">Checkout</h1>
          <p className="text-base-content/70">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-6">
                <h2 className="text-xl font-semibold text-base-content mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-base-content/70">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-base-300 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(getTotal() * 100)}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-base-content mb-4">Delivery Method</h2>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input type="radio" name="deliveryMethod" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup' as const)} className="radio radio-primary mr-3" />
                    <div>
                      <p className="font-medium">Pickup from Store</p>
                      <p className="text-sm text-base-content/70">Collect your order from our Durban North location</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="deliveryMethod" value="shipping" checked={deliveryMethod === 'shipping'} onChange={() => setDeliveryMethod('shipping' as const)} className="radio radio-primary mr-3" />
                    <div>
                      <p className="font-medium">Shipping</p>
                      <p className="text-sm text-base-content/70">We deliver to your address</p>
                    </div>
                  </label>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-6">
                <h2 className="text-xl font-semibold text-base-content mb-4">Customer Information</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input type="text" placeholder="First Name" value={customerInfo.firstName} onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })} required />
                  <Input type="text" placeholder="Last Name" value={customerInfo.lastName} onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <Input type="email" placeholder="Email Address" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <Input type="tel" placeholder="Phone Number" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} required />
                </div>
              </Card>

              {deliveryMethod === 'pickup' ? (
                <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-6">
                  <h2 className="text-xl font-semibold text-base-content mb-4">Pickup Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">Pickup Date</label>
                      <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">Pickup Time</label>
                      <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="select select-bordered w-full" required>
                        <option value="">Select time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-6">
                  <h2 className="text-xl font-semibold text-base-content mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <Input type="text" placeholder="Address Line 1" value={shippingAddress.addressLine1} onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })} required />
                    <Input type="text" placeholder="Address Line 2 (Optional)" value={shippingAddress.addressLine2} onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="text" placeholder="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} required />
                      <Input type="text" placeholder="State/Province" value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="text" placeholder="Postal Code" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} required />
                      <Input type="text" placeholder="Country" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} required />
                    </div>
                  </div>
                </Card>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary-focus text-primary-content font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" disabled={loading}>{loading ? 'Placing Order...' : 'Place Order'}</Button>
            </div>
          </div>
        </form>

        {orderPlaced && (
          <div className="mt-6">
            <div className="alert alert-success shadow-lg">
              <div>
                <span className="text-2xl mr-2">✅</span>
                <div>
                  <div className="font-semibold">Order placed</div>
                  <div className="text-sm">Your order <strong>#{orderPlaced!.orderNo}</strong> was placed successfully. Redirecting to confirmation...</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {orderPlaced && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black/60 absolute inset-0" onClick={() => router.push(`/order-confirmation?orderId=${orderPlaced!.id}`)} />
            <div className="bg-white rounded-lg shadow-xl p-6 z-10 w-full max-w-md">
              <div className="text-center">
                <div className="text-4xl">✅</div>
                <h3 className="text-2xl font-semibold mt-2">Order Placed</h3>
                <p className="text-base-content/70 mt-2">Your order <strong>#{orderPlaced!.orderNo}</strong> was placed successfully.</p>
                <p className="text-sm text-base-content/70 mt-1">Delivery method: <strong>{orderPlaced!.deliveryMethod === 'pickup' ? 'Pickup' : 'Shipping'}</strong></p>

                <div className="mt-4 flex justify-center gap-3">
                  <Button onClick={() => router.push(`/order-confirmation?orderId=${orderPlaced!.id}`)} className="btn-primary">View Order</Button>
                  <Button onClick={() => router.push('/shop')} className="btn-ghost">Continue Shopping</Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
