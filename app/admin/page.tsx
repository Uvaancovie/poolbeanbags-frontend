"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { API_BASE } from 'lib/api';

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalAnnouncements: number;
  totalCustomers: number;
  recentOrders: any[];
  recentContacts: any[];
  unreadContacts: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalAnnouncements: 0,
    totalCustomers: 0,
    recentOrders: [],
    recentContacts: [],
    unreadContacts: 0
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
    const safeNumber = (n: any) => {
      if (n === null || n === undefined) return 0;
      if (typeof n === 'number') return n;
      if (typeof n === 'string' && !isNaN(Number(n))) return Number(n);
      return 0;
    };

    const formatPrice = (value: any) => `R${(safeNumber(value)).toFixed(2)}`;

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
    loadDashboardData();
  }

  async function loadDashboardData() {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');

      // Parallelize independent requests
      const [productsRes, announcementsRes, ordersRes, contactsRes] = await Promise.all([
        fetch(`${API_BASE}/api/products`),
        fetch(`${API_BASE}/api/announcements`),
        fetch(`${API_BASE}/api/admin/orders`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/admin/contacts`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const productsData = await productsRes.json();
      const products = Array.isArray(productsData) ? productsData : [];
      const announcementsData = await announcementsRes.json();
      const announcements = Array.isArray(announcementsData) ? announcementsData : [];

      const ordersData = await ordersRes.json();
      const orders = ordersData.orders || [];

      const contactsData = await contactsRes.json();
      const contacts = contactsData.contacts || [];

      // Calculate total revenue from orders, excluding cancelled orders
      const totalRevenue = orders
        .filter((order: any) => order.status !== 'cancelled')
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

      // Get unique customers
      const uniqueCustomers = new Set(orders.map((order: any) => order.customer?.email).filter(Boolean));
      const totalCustomers = uniqueCustomers.size;

      const unreadContacts = contacts.filter((contact: any) => !contact.is_read).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        totalAnnouncements: announcements.length,
        totalCustomers,
        recentOrders: orders.slice(0, 20),
        recentContacts: contacts.slice(0, 5),
        unreadContacts
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  // Poll for updates while admin is authenticated
  useEffect(() => {
    if (authLoading) return;
    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);
    return () => clearInterval(interval);
  }, [authLoading]);

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
              <h1 className="text-2xl font-bold text-base-content">Admin Dashboard</h1>
              <p className="text-base-content/70">Manage your pool beanbag business</p>
            </div>
            <Button
              onClick={() => {
                localStorage.removeItem('admin_token');
                router.push('/admin/login');
              }}
              className="btn btn-outline btn-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-base-content mb-1">Total Products</h3>
                {loading ? (
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                ) : (
                  <p className="text-3xl font-bold text-primary">{stats.totalProducts}</p>
                )}
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </Card>

          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-base-content mb-1">Total Orders</h3>
                {loading ? (
                  <span className="loading loading-spinner loading-lg text-secondary"></span>
                ) : (
                  <p className="text-3xl font-bold text-secondary">{stats.totalOrders}</p>
                )}
              </div>
              <div className="text-4xl">🛒</div>
            </div>
          </Card>

          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-base-content mb-1">Total Revenue</h3>
                {loading ? (
                  <span className="loading loading-spinner loading-lg text-success"></span>
                ) : (
              <p className="text-3xl font-bold text-success">{formatPrice(stats.totalRevenue)}</p>
                )}
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </Card>

          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-base-content mb-1">Total Customers</h3>
                {loading ? (
                  <span className="loading loading-spinner loading-lg text-accent"></span>
                ) : (
                  <p className="text-3xl font-bold text-accent">{stats.totalCustomers}</p>
                )}
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Card>

          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-base-content mb-1">Unread Contacts</h3>
                {loading ? (
                  <span className="loading loading-spinner loading-lg text-info"></span>
                ) : (
                  <p className="text-3xl font-bold text-info">{stats.unreadContacts}</p>
                )}
              </div>
              <div className="text-4xl">📬</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Management Actions */}
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-base-content mb-6">Management</h2>
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/shop/add')}
                className="w-full bg-primary hover:bg-primary-focus text-primary-content font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Product
              </Button>

              <Button
                onClick={() => router.push('/admin/announcements')}
                className="w-full bg-secondary hover:bg-secondary-focus text-secondary-content font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Manage Announcements
              </Button>

              <Button
                onClick={() => router.push('/admin/orders')}
                className="w-full bg-accent hover:bg-accent-focus text-accent-content font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Orders & Invoices
              </Button>

              <Button
                onClick={() => router.push('/admin/contacts')}
                className="w-full bg-info hover:bg-info-focus text-info-content font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Manage Contacts
              </Button>
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-base-content">Recent Orders</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm">Status:</label>
                <select className="select select-sm" value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-base-content/70">Loading orders...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders
                  .filter((o) => orderStatusFilter === 'all' ? true : o.status === orderStatusFilter)
                  .slice(0, 20)
                  .map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                      <div>
                        <p className="font-medium text-base-content">Order #{order.orderNo}</p>
                        <p className="text-sm text-base-content/70">
                          {order.customer ? `${order.customer.name} (${order.customer.email})` : 'Guest'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-base-content">{formatPrice(order.total)}</p>
                        <Badge className={`badge badge-sm ${
                          order.status === 'completed' ? 'badge-success' :
                          order.status === 'processing' ? 'badge-info' :
                          order.status === 'pending' ? 'badge-warning' : 'badge-neutral'
                        }`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          {/* Recent Contacts */}
          <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-base-content mb-6">Recent Contacts</h2>
            {stats.recentContacts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📬</div>
                <p className="text-base-content/70">No recent contacts</p>
                <p className="text-sm text-base-content/50 mt-2">Contact form submissions will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                    <div>
                      <p className="font-medium text-base-content">{contact.name}</p>
                      <p className="text-sm text-base-content/70">{contact.email}</p>
                      {contact.phone && (
                        <p className="text-sm text-base-content/70">{contact.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={`badge badge-sm ${
                        contact.is_read ? 'badge-success' : 'badge-warning'
                      }`}>
                        {contact.is_read ? 'Read' : 'Unread'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-base-content mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/shop"
              className="flex items-center gap-3 p-4 bg-base-100 hover:bg-base-200 rounded-lg transition-colors"
            >
              <div className="text-2xl">🏊‍♂️</div>
              <div>
                <h3 className="font-medium text-base-content">View Shop</h3>
                <p className="text-sm text-base-content/70">See customer view</p>
              </div>
            </a>

            <a
              href="/admin/products"
              className="flex items-center gap-3 p-4 bg-base-100 hover:bg-base-200 rounded-lg transition-colors"
            >
              <div className="text-2xl">📦</div>
              <div>
                <h3 className="font-medium text-base-content">Product List</h3>
                <p className="text-sm text-base-content/70">Manage all products</p>
              </div>
            </a>

            <a
              href="/admin/shipping"
              className="flex items-center gap-3 p-4 bg-base-100 hover:bg-base-200 rounded-lg transition-colors"
            >
              <div className="text-2xl">🚚</div>
              <div>
                <h3 className="font-medium text-base-content">Shipping</h3>
                <p className="text-sm text-base-content/70">Manage shipping</p>
              </div>
            </a>

            <button
              onClick={() => {
                localStorage.removeItem('admin_token');
                router.push('/admin/login');
              }}
              className="flex items-center gap-3 p-4 bg-base-100 hover:bg-base-200 rounded-lg transition-colors text-left"
            >
              <div className="text-2xl">🚪</div>
              <div>
                <h3 className="font-medium text-base-content">Logout</h3>
                <p className="text-sm text-base-content/70">Sign out</p>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}