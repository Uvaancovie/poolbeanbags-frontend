"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from 'lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalAnnouncements: 0,
    unreadContacts: 0
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);

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

      const [productsRes, announcementsRes, ordersRes, contactsRes] = await Promise.all([
        fetch(`${API_BASE}/api/products`),
        fetch(`${API_BASE}/api/announcements`),
        fetch(`${API_BASE}/api/admin/orders`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/admin/contacts`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const products = await productsRes.json();
      const announcements = await announcementsRes.json();
      const ordersData = await ordersRes.json();
      const contactsData = await contactsRes.json();

      const orders = Array.isArray(ordersData) ? ordersData : ordersData.orders || [];
      const contacts = Array.isArray(contactsData) ? contactsData : contactsData.contacts || [];

      const totalRevenue = orders
        .filter((o: any) => o.status === 'paid' || o.status === 'delivered')
        .reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0);

      const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'paid').length;
      const unreadContacts = contacts.filter((c: any) => !c.read && !c.is_read).length;

      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue: totalRevenue / 100,
        totalAnnouncements: Array.isArray(announcements) ? announcements.length : 0,
        unreadContacts
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4"></div>
          <p className="text-[var(--fg-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--fg)] mb-2">Admin Dashboard</h1>
            <p className="text-[var(--fg-muted)]">Manage your pool beanbags store</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition-colors rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <div className="text-[var(--fg-muted)] text-sm mb-2">Total Products</div>
            <div className="text-3xl font-bold text-[var(--fg)]">{stats.totalProducts}</div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <div className="text-[var(--fg-muted)] text-sm mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-[var(--fg)]">{stats.totalOrders}</div>
            <div className="text-sm text-[var(--fg-muted)] mt-1">{stats.pendingOrders} pending</div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <div className="text-[var(--fg-muted)] text-sm mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-[var(--fg)]">R{stats.totalRevenue.toFixed(2)}</div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <div className="text-[var(--fg-muted)] text-sm mb-2">Announcements</div>
            <div className="text-3xl font-bold text-[var(--fg)]">{stats.totalAnnouncements}</div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <div className="text-[var(--fg-muted)] text-sm mb-2">Contact Messages</div>
            <div className="text-3xl font-bold text-[var(--fg)]">{stats.unreadContacts}</div>
            <div className="text-sm text-[var(--fg-muted)] mt-1">unread</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[var(--fg)] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/products')}
              className="p-4 border border-black bg-white hover:bg-black hover:text-white transition-colors rounded-lg text-left"
            >
              <div className="text-2xl mb-2"></div>
              <div className="font-bold">Manage Products</div>
              <div className="text-sm opacity-70">Add, edit, delete products</div>
            </button>

            <button
              onClick={() => router.push('/admin/announcements')}
              className="p-4 border border-black bg-white hover:bg-black hover:text-white transition-colors rounded-lg text-left"
            >
              <div className="text-2xl mb-2"></div>
              <div className="font-bold">Announcements</div>
              <div className="text-sm opacity-70">Create and manage announcements</div>
            </button>

            <button
              onClick={() => router.push('/admin/orders')}
              className="p-4 border border-black bg-white hover:bg-black hover:text-white transition-colors rounded-lg text-left"
            >
              <div className="text-2xl mb-2"></div>
              <div className="font-bold">View Orders</div>
              <div className="text-sm opacity-70">Process and track orders</div>
            </button>

            <button
              onClick={() => router.push('/admin/contacts')}
              className="p-4 border border-black bg-white hover:bg-black hover:text-white transition-colors rounded-lg text-left"
            >
              <div className="text-2xl mb-2"></div>
              <div className="font-bold">Contact Messages</div>
              <div className="text-sm opacity-70">View customer inquiries</div>
            </button>

            <button
              onClick={() => router.push('/admin/shipping')}
              className="p-4 border border-black bg-white hover:bg-black hover:text-white transition-colors rounded-lg text-left"
            >
              <div className="text-2xl mb-2"></div>
              <div className="font-bold">Shipping</div>
              <div className="text-sm opacity-70">Manage shipping information</div>
            </button>

            <button
              onClick={() => router.push('/')}
              className="p-4 border border-black bg-white hover:bg-black hover:text-white transition-colors rounded-lg text-left"
            >
              <div className="text-2xl mb-2"></div>
              <div className="font-bold">View Store</div>
              <div className="text-sm opacity-70">Go to main website</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
