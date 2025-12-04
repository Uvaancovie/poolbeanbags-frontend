"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../../../../components/ui/Button';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import { API_BASE } from 'lib/api';
import Image from 'next/image';

interface Order {
  id: string;
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
  items: {
    id: string;
    quantity: number;
    price: number;
    fabric?: string;
    product: {
      id: string;
      name: string;
      image: string;
      slug: string;
    };
  }[];
  delivery: any;
  shipping_address?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  billing_address?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
}

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(false);

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
    fetchOrder();
  }

  async function fetchOrder() {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const order = data;
        const customer = order.shipping_address ? {
          name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
          email: order.shipping_address.email,
          phone: order.shipping_address.phone
        } : order.billing_address ? {
          name: `${order.billing_address.first_name} ${order.billing_address.last_name}`,
          email: order.billing_address.email,
          phone: order.billing_address.phone
        } : null;

        const mappedItems = order.items.map((item: any) => ({
          id: item._id,
          quantity: item.quantity,
          price: item.unit_price_cents / 100,
          fabric: item.fabric,
          product: {
            id: item.product_id._id,
            name: item.product_id.name,
            image: item.product_id.image,
            slug: item.product_id.slug
          }
        }));

        setOrder({
          id: order._id,
          orderNo: order.order_no,
          status: order.status,
          paymentStatus: order.payment_status,
          total: order.total_cents / 100,
          createdAt: order.created_at,
          customer,
          items: mappedItems,
          delivery: order.delivery,
          shipping_address: order.shipping_address,
          billing_address: order.billing_address
        });
      } else {
        router.push('/admin/orders');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(newStatus: string) {
    if (!order) return;
    try {
      setUpdatingOrder(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders/${order.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrder({ ...order, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdatingOrder(false);
    }
  }

  async function updateDelivery(trackingNumber: string, deliveryStatus: string) {
    if (!order) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders/${order.id}/delivery`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ trackingNumber, deliveryStatus })
      });

      if (response.ok) {
        fetchOrder(); // Refresh
      }
    } catch (error) {
      console.error('Failed to update delivery:', error);
    }
  }

  async function deleteOrder() {
    if (!order) return;
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders/${order.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        router.push('/admin/orders');
      } else {
        alert('Failed to delete order');
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete order');
    }
  }

  const formatPrice = (cents: number) => {
    const n = cents ?? 0;
    return `R${(n / 100).toFixed(2)}`;
  };

  const downloadInvoice = async () => {
    if (!order) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders/${order.id}/invoice`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.orderNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download invoice:', error);
    }
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">
            {authLoading ? 'Checking authentication...' : 'Loading order details...'}
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-base-content mb-4">Order Not Found</h2>
          <Button onClick={() => router.push('/admin/orders')} className="btn btn-primary">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Order #{order.orderNo}
              </h1>
              <p className="text-base-content/70">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={downloadInvoice}
                className="btn btn-outline btn-sm"
              >
                Download Invoice
              </Button>
              <Button
                onClick={() => router.push('/admin/orders')}
                className="btn btn-outline btn-sm"
              >
                Back to Orders
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Actions */}
            <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-base-content">Order Status</h2>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <Badge className={`badge badge-sm ${
                    order.paymentStatus === 'paid' ? 'badge-success' :
                    order.paymentStatus === 'pending' ? 'badge-warning' :
                    order.paymentStatus === 'failed' ? 'badge-error' : 'badge-neutral'
                  }`}>
                    {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  disabled={updatingOrder}
                  className="select select-bordered select-sm flex-1"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  onClick={deleteOrder}
                  className="btn btn-error btn-sm"
                >
                  Delete Order
                </Button>
              </div>
            </Card>

            {/* Products */}
            <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-base-content mb-4">Ordered Products</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-base-300 rounded-lg">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-base-200">
                      <Image
                        src={item.product.image || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-base-content">{item.product.name}</h3>
                      {item.fabric && <p className="text-sm text-base-content/70">Fabric: {item.fabric}</p>}
                      <p className="text-sm text-base-content/70">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium text-primary">{formatPrice(item.price * 100)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Customer & Addresses */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-base-content mb-4">Customer Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {order.customer?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.customer?.phone || 'N/A'}</p>
              </div>
            </Card>

            {/* Shipping Address */}
            {order.shipping_address && (
              <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-base-content mb-4">Shipping Address</h2>
                <div className="space-y-1 text-sm">
                  <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                  <p>{order.shipping_address.address_line_1}</p>
                  {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                  <p>{order.shipping_address.country}</p>
                  <p>{order.shipping_address.email}</p>
                  <p>{order.shipping_address.phone}</p>
                </div>
              </Card>
            )}

            {/* Billing Address */}
            {order.billing_address && (
              <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-base-content mb-4">Billing Address</h2>
                <div className="space-y-1 text-sm">
                  <p>{order.billing_address.first_name} {order.billing_address.last_name}</p>
                  <p>{order.billing_address.address_line_1}</p>
                  {order.billing_address.address_line_2 && <p>{order.billing_address.address_line_2}</p>}
                  <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}</p>
                  <p>{order.billing_address.country}</p>
                  <p>{order.billing_address.email}</p>
                  <p>{order.billing_address.phone}</p>
                </div>
              </Card>
            )}

            {/* Order Total */}
            <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-base-content mb-4">Order Summary</h2>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{formatPrice(order.total * 100)}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}