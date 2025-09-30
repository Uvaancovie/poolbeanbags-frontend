"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

interface Order {
  id: number;
  orderNo: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  } | null;
  items: any[];
  delivery: any;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (data.user.role !== 'admin') {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }
    } catch (err) {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
      return;
    }

    setAuthLoading(false);
    fetchOrders();
  }

  async function fetchOrders() {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
      setUpdatingOrder(orderId);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdatingOrder(null);
    }
  }

  async function updateDelivery(orderId: number, trackingNumber: string, deliveryStatus: string) {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}/delivery`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ trackingNumber, deliveryStatus })
      });

      if (response.ok) {
        fetchOrders(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update delivery:', error);
    }
  }

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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-base-content">Orders Management</h1>
              <p className="text-base-content/70">View and manage all customer orders</p>
            </div>
            <Button
              onClick={() => router.push('/admin')}
              className="btn btn-outline btn-sm"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-semibold text-base-content mb-2">No orders yet</h3>
            <p className="text-base-content/70">Orders will appear here once customers start placing them.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-xl font-semibold text-base-content">
                      Order #{order.orderNo}
                    </h3>
                    <p className="text-base-content/70">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                    {order.customer && (
                      <div className="mt-2">
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-base-content/70">{order.customer.email}</p>
                        <p className="text-sm text-base-content/70">{order.customer.phone}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Badge className={`badge badge-sm ${
                        order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-base-content">
                      {formatPrice(order.total * 100)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-base-content mb-2">Items:</h4>
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
                </div>

                {/* Delivery Information */}
                {order.delivery && (
                  <div className="mb-4 p-4 bg-base-100 rounded-lg">
                    <h4 className="font-semibold text-base-content mb-2">Delivery:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-base-content/70">Method:</p>
                        <p className="font-medium capitalize">{order.delivery.delivery_method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Status:</p>
                        <p className="font-medium capitalize">{order.delivery.delivery_status}</p>
                      </div>
                      {order.delivery.pickup_date && (
                        <div>
                          <p className="text-sm text-base-content/70">Pickup Date:</p>
                          <p className="font-medium">
                            {new Date(order.delivery.pickup_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {order.delivery.pickup_time && (
                        <div>
                          <p className="text-sm text-base-content/70">Pickup Time:</p>
                          <p className="font-medium">{order.delivery.pickup_time}</p>
                        </div>
                      )}
                      {order.delivery.tracking_number && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-base-content/70">Tracking Number:</p>
                          <p className="font-medium">{order.delivery.tracking_number}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {/* Status Update */}
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    disabled={updatingOrder === order.id}
                    className="select select-bordered select-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Delivery Update */}
                  {order.delivery?.delivery_method === 'shipping' && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tracking number"
                        className="input input-bordered input-sm"
                        onBlur={(e) => {
                          if (e.target.value) {
                            updateDelivery(order.id, e.target.value, order.delivery.delivery_status);
                          }
                        }}
                      />
                      <select
                        value={order.delivery.delivery_status}
                        onChange={(e) => updateDelivery(order.id, order.delivery.tracking_number || '', e.target.value)}
                        className="select select-bordered select-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  )}

                  {/* Download Invoice */}
                  <Button
                    onClick={() => window.open(`${API_BASE}/api/orders/${order.id}/invoice`, '_blank')}
                    className="btn btn-sm btn-outline"
                  >
                    Download Invoice
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
