"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import { API_BASE } from 'lib/api';

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
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
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

  async function updateOrderStatus(orderId: string, newStatus: string) {
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

  async function deleteOrder(orderId: string) {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchOrders(); // Refresh the list
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
                Orders Management {filteredOrders.length !== orders.length ? `(${filteredOrders.length} of ${orders.length} orders)` : `(${orders.length} orders)`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="block">
                <Card className="p-4 shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="flex flex-col h-full">
                    {/* Order Header */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-base-content">
                        Order #{order.orderNo}
                      </h3>
                      <p className="text-sm text-base-content/70">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status Badges */}
                    <div className="flex gap-2 mb-3">
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

                    {/* Customer and Total */}
                    <div className="mb-3 flex-1">
                      <p className="text-sm text-base-content/70">Customer</p>
                      <p className="font-medium text-base-content mb-2">
                        {order.customer?.name || 'N/A'}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        R{formatPrice(order.total * 100)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, e.target.value);
                        }}
                        disabled={updatingOrder === order.id}
                        className="select select-bordered select-xs w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="picked_up">Picked Up</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOrder(order.id);
                        }}
                        className="btn btn-error btn-xs w-full"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
