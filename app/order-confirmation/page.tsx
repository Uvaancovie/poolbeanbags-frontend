"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { API_BASE } from 'lib/api';

interface Order {
  id: number;
  orderNo: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
  delivery: any;
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
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-4xl font-bold text-base-content mb-4">Order Not Found</h1>
          <p className="text-base-content/70 mb-8">We couldn't find the order you're looking for.</p>
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-bold text-base-content mb-4">Order Confirmed!</h1>
          <p className="text-lg text-base-content/70">
            Thank you for your order. Your order is being processed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-base-content mb-4">Order Details</h2>

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