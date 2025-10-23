"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  

  const fetchOrders = async () => {
    if (!email.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/orders?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const formatPrice = (cents: number) => {
    return `R${(cents / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'shipped': return 'badge-primary';
      case 'delivered': return 'badge-success';
      case 'picked_up': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">My Orders</h1>
          <p className="text-base-content/70">View and track your order history</p>
        </div>

        {/* Email Search */}
        <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Find Orders'}
            </Button>
          </form>
        </Card>

        {/* Orders List */}
        {searched && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-base-content/70">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <Card className="p-12 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">No orders found</h3>
                <p className="text-base-content/70 mb-6">
                  We couldn't find any orders associated with this email address.
                </p>
                <Link href="/shop" className="btn btn-primary">
                  Start Shopping
                </Link>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-base-content">
                          Order #{order.orderNo}
                        </h3>
                        <p className="text-base-content/70">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 lg:mt-0">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <span className="text-lg font-semibold text-base-content">
                          {formatPrice(order.total * 100)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-base-content mb-2">Items:</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span>{item.product_title} (x{item.quantity})</span>
                            <span>{formatPrice(item.total_price_cents)}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-base-content/70">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    {order.delivery && (
                      <div className="mb-4 p-3 bg-base-100 rounded-lg">
                        <h4 className="font-semibold text-base-content mb-2">Delivery:</h4>
                        <div className="text-sm text-base-content/70">
                          {order.delivery.delivery_method === 'pickup' ? (
                            <div>
                              <p>🏪 Store Pickup</p>
                              {order.delivery.pickup_date && (
                                <p>Date: {new Date(order.delivery.pickup_date).toLocaleDateString()}</p>
                              )}
                              {order.delivery.pickup_time && (
                                <p>Time: {order.delivery.pickup_time}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <p>🚚 Shipping</p>
                              <p>Status: {order.delivery.delivery_status}</p>
                              {order.delivery.tracking_number && (
                                <p>Tracking: {order.delivery.tracking_number}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        href={`/order-confirmation?orderId=${order.id}`}
                        className="btn btn-sm btn-outline"
                      >
                        View Details
                      </Link>
                      <Button
                        onClick={() => window.open(`${API_BASE}/api/orders/${order.id}/invoice`, '_blank')}
                        className="btn btn-sm btn-ghost"
                      >
                        Download Invoice
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Help Text */}
        {!searched && (
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm text-center">
            <h3 className="text-lg font-semibold text-base-content mb-2">Find Your Orders</h3>
            <p className="text-base-content/70">
              Enter the email address you used when placing your order to view your order history.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}