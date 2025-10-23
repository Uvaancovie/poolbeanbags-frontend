"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { API_BASE } from 'lib/api';

interface Order {
  id: number;
  orderNo: string;
  status: string;
  total: number;
  shipping_cents?: number;
  createdAt: string;
  items: any[];
  delivery: any;
  shipping_address: any;
  billing_address: any;
}

export default function OrderConfirmationPage() {
  // Avoid using next/navigation useSearchParams in a component that may be prerendered.
  // Use window.location.search on the client to safely read the query param.
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('orderId');
      setOrderId(id);
      if (id) fetchOrder(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchOrder = async (id: string | null) => {
    if (!id) return;
    try {
      const response = await fetch(`${API_BASE}/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border-t-8 border-red-500">
            <div className="text-8xl mb-6">❌</div>
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Order Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">We couldn't find the order you're looking for. 🔍</p>
            <Link href="/shop" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-block">
              🛍️ Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 bg-gradient-to-r from-green-500 via-yellow-400 to-blue-600 rounded-3xl p-12 shadow-2xl">
          <div className="text-8xl mb-6 animate-bounce">✅</div>
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl">Order Confirmed!</h1>
          <p className="text-2xl text-white/95 font-medium">
            Thank you for your order! Your order is being processed. 🎉
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card className="p-8 shadow-2xl border-l-8 border-green-500 bg-white rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">📦</span> Order Details
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-base-content/70">Order Number:</span>
                <span className="font-semibold">{order.orderNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">Order Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">Status:</span>
                <span className={`badge ${
                  order.status === 'pending' ? 'badge-warning' :
                  order.status === 'processing' ? 'badge-info' :
                  order.status === 'completed' ? 'badge-success' : 'badge-neutral'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">Total:</span>
                <span className="font-semibold text-lg">{formatPrice(order.total * 100)}</span>
              </div>
            </div>

            <h3 className="font-semibold text-base-content mb-3">Items Ordered:</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-base-200 last:border-b-0">
                  <div>
                    <p className="font-medium">{item.product_title}</p>
                    <p className="text-sm text-base-content/70">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.total_price_cents)}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Delivery Information */}
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-base-content mb-4">Delivery Information</h2>

            {order.delivery?.delivery_method === 'pickup' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏪</span>
                  <span className="font-medium">Store Pickup</span>
                </div>
                {order.delivery.pickup_date && (
                  <div>
                    <p className="text-base-content/70">Pickup Date:</p>
                    <p className="font-semibold">
                      {new Date(order.delivery.pickup_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {order.delivery.pickup_time && (
                  <div>
                    <p className="text-base-content/70">Pickup Time:</p>
                    <p className="font-semibold">{order.delivery.pickup_time}</p>
                  </div>
                )}
                <p className="text-sm text-base-content/70 mt-4">
                  Please bring this order confirmation and valid ID when collecting your order.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  <span className="font-medium">Shipping</span>
                </div>
                {order.shipping_cents !== undefined && order.shipping_cents > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-base-content/70 text-sm">Shipping Cost:</p>
                    <p className="font-bold text-lg text-blue-700">
                      {order.shipping_cents === 0 ? 'FREE' : formatPrice(order.shipping_cents)}
                    </p>
                    {order.shipping_cents >= 12900 && order.shipping_cents <= 27900 && (
                      <p className="text-xs text-base-content/60 mt-1">
                        {order.shipping_cents === 12900 && '🚚 KZN • 1-2 business days'}
                        {order.shipping_cents === 19900 && '🚚 Major centres • 2-3 business days'}
                        {order.shipping_cents === 27900 && '🚚 Remote areas • 3-5 business days'}
                      </p>
                    )}
                  </div>
                )}
                {order.shipping_address && (
                  <div>
                    <p className="text-base-content/70 mb-2">Shipping Address:</p>
                    <div className="bg-base-100 p-3 rounded-lg">
                      <p className="font-semibold">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                      <p>{order.shipping_address.address_line_1}</p>
                      {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                      <p>{order.shipping_address.country}</p>
                      {order.shipping_address.phone && <p className="mt-2">📞 {order.shipping_address.phone}</p>}
                      {order.shipping_address.email && <p>✉️ {order.shipping_address.email}</p>}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-base-content/70">Delivery Status:</p>
                  <p className="font-semibold capitalize">{order.delivery?.delivery_status || 'Pending'}</p>
                </div>
                {order.delivery?.tracking_number && (
                  <div>
                    <p className="text-base-content/70">Tracking Number:</p>
                    <p className="font-semibold">{order.delivery.tracking_number}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-base-300">
              <h3 className="font-semibold text-base-content mb-2">What's Next?</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Track your order status in your account</li>
                <li>• Contact us if you have any questions</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Payment Button - Show if order is pending */}
        {order.status === 'pending' && (
          <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-400 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">💳</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Complete Your Payment</h2>
            <p className="text-lg text-gray-700 mb-6">
              Your order is reserved! Click below to complete payment via PayFast.
            </p>
            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await fetch(`${API_BASE}/api/checkout/pay/${order.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                  });
                  if (!response.ok) throw new Error('Failed to generate payment link');
                  const data = await response.json();
                  window.location.href = data.redirect;
                } catch (error) {
                  console.error('Payment redirect failed:', error);
                  alert('Unable to redirect to payment. Please contact support.');
                  setLoading(false);
                }
              }}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-xl text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
              disabled={loading}
            >
              {loading ? '🔄 Redirecting...' : '💰 Pay Now with PayFast'}
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              🔒 Secure payment powered by PayFast • All major cards accepted
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 text-center space-x-4">
          <Link href="/orders" className="btn btn-primary">
            View My Orders
          </Link>
          <Link href="/shop" className="btn btn-outline">
            Continue Shopping
          </Link>
          <Button
            onClick={() => window.print()}
            className="btn btn-ghost"
          >
            Print Order
          </Button>
          {/* Invoice download - attempts to fetch PDF from backend invoices endpoint */}
          <Button
            onClick={async () => {
              try {
                const res = await fetch(`${API_BASE}/api/invoices/${order.orderNo}`);
                if (!res.ok) throw new Error('Invoice not ready');
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoice-${order.orderNo}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (err) {
                alert('Invoice not ready yet. The admin will generate and send it shortly.');
              }
            }}
            className="btn btn-outline"
          >
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}