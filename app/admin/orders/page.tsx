"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import { API_BASE } from 'lib/api';

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

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter]);

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

  function filterOrders() {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer?.email && order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter) {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    setFilteredOrders(filtered);
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
    const n = cents ?? 0;
    return `R${(n / 100).toFixed(2)}`;
  };

  const downloadInvoice = async (orderId: number, orderNo: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}/invoice`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderNo}.pdf`;
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
      <div className="bg-white/80 backdrop-blur border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Orders Management
              </h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <Card className="p-4 mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="picked_up">Picked Up</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </Card>
        {loading ? (
          <div className="text-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
            </h3>
            <p className="text-base-content/70">
              {orders.length === 0
                ? 'Orders will appear here once customers start placing them.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {filteredOrders.length !== orders.length && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPaymentFilter('');
                }}
                className="btn btn-primary btn-sm mt-4"
              >
                Clear Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-base-content/70">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-base-content">
                        Order #{order.orderNo}
                      </h3>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge className={`badge badge-sm ${
                          order.paymentStatus === 'paid' ? 'badge-success' :
                          order.paymentStatus === 'pending' ? 'badge-warning' :
                          order.paymentStatus === 'failed' ? 'badge-error' : 'badge-neutral'
                        }`}>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                          {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-base-content/70 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary mb-2">
                      R{formatPrice(order.total * 100)}
                    </p>
                    <p className="text-sm text-base-content/70">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Customer Information */}
                {order.customer && (
                  <div className="mb-6 p-4 bg-base-100 rounded-lg">
                    <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Customer Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-base-content/70">Name</p>
                        <p className="font-medium">{order.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Email</p>
                        <p className="font-medium">{order.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Phone</p>
                        <p className="font-medium">{order.customer.phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {order.delivery?.delivery_method === 'shipping' && order.shipping_address && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Shipping Address
                    </h4>
                    <div className="text-sm">
                      <p className="font-medium">
                        {order.shipping_address.first_name} {order.shipping_address.last_name}
                      </p>
                      <p className="text-base-content/70">{order.shipping_address.address_line_1}</p>
                      {order.shipping_address.address_line_2 && (
                        <p className="text-base-content/70">{order.shipping_address.address_line_2}</p>
                      )}
                      <p className="text-base-content/70">
                        {order.shipping_address.city}, {order.shipping_address.postal_code}
                      </p>
                      {order.shipping_address.state && (
                        <p className="text-base-content/70">{order.shipping_address.state}</p>
                      )}
                      <p className="text-base-content/70">{order.shipping_address.country}</p>
                      <p className="text-base-content/70 mt-1">{order.shipping_address.phone}</p>
                    </div>
                  </div>
                )}

                {/* Pickup Customer Details */}
                {order.delivery?.delivery_method === 'pickup' && order.billing_address && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Pickup Customer Details
                    </h4>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        {order.billing_address.first_name} {order.billing_address.last_name}
                      </p>
                      <p className="text-base-content/70">{order.billing_address.email}</p>
                      <p className="text-base-content/70">{order.billing_address.phone}</p>
                      <p className="text-base-content/70 mt-2 font-medium">📍 Pickup Location: Durban North Store</p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 px-4 bg-base-100 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-base-content">{item.product_title}</p>
                          <p className="text-sm text-base-content/70">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-base-content">
                          R{formatPrice(item.total_price_cents)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                {order.delivery && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Delivery Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-base-content/70">Method</p>
                        <p className="font-medium capitalize flex items-center gap-1">
                          {order.delivery.delivery_method === 'shipping' ? (
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                          {order.delivery.delivery_method}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-base-content/70">Status</p>
                        <p className="font-medium capitalize">{order.delivery.delivery_status}</p>
                      </div>
                      {order.delivery.pickup_date && (
                        <div>
                          <p className="text-sm text-base-content/70">Pickup Date</p>
                          <p className="font-medium">
                            {new Date(order.delivery.pickup_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {order.delivery.pickup_time && (
                        <div>
                          <p className="text-sm text-base-content/70">Pickup Time</p>
                          <p className="font-medium">{order.delivery.pickup_time}</p>
                        </div>
                      )}
                      {order.delivery.tracking_number && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-base-content/70">Tracking Number</p>
                          <p className="font-medium font-mono bg-white px-2 py-1 rounded border">
                            {order.delivery.tracking_number}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-base-200">
                  {/* Status Update */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-base-content">Order Status:</label>
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
                  </div>

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
                    onClick={() => downloadInvoice(order.id, order.orderNo)}
                    className="btn btn-outline btn-sm"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Invoice
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
