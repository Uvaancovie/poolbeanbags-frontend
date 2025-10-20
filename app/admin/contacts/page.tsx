"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { API_BASE } from 'lib/api';

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(true);

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
    loadContacts();
  }

  async function loadContacts() {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/api/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setContacts(data || []);
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  }

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
              <h1 className="text-2xl font-bold text-base-content">Contact Management</h1>
              <p className="text-base-content/70">View and manage customer inquiries</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/admin')}
                className="btn btn-outline btn-sm"
              >
                Back to Dashboard
              </Button>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : contacts.length === 0 ? (
          <Card className="p-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-6xl mb-6">📬</div>
            <h2 className="text-2xl font-bold text-base-content mb-4">No Contact Submissions Yet</h2>
            <p className="text-base-content/70 mb-6">
              When customers submit the contact form, their inquiries will appear here for you to review and respond to.
            </p>
            <Button
              onClick={() => router.push('/contact')}
              className="btn btn-primary"
            >
              View Contact Page
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-base-content mb-1">Total Contacts</h3>
                    <p className="text-3xl font-bold text-primary">{contacts.length}</p>
                  </div>
                  <div className="text-4xl">📬</div>
                </div>
              </Card>
            </div>

            {/* Contacts List */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-base-content">All Contact Submissions</h2>
                <p className="text-base-content/70">Review and manage customer inquiries</p>
              </div>

              <div className="divide-y divide-base-200">
                {contacts.map((contact) => (
                  <div key={contact._id} className="p-6 hover:bg-base-100/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-base-content">{contact.name}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-base-content/70 mb-1">Email</p>
                            <p className="text-base-content font-medium">{contact.email}</p>
                          </div>
                          {contact.phone && (
                            <div>
                              <p className="text-sm text-base-content/70 mb-1">Phone</p>
                              <p className="text-base-content font-medium">{contact.phone}</p>
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-base-content/70 mb-2">Message</p>
                          <div className="bg-base-100 p-4 rounded-lg">
                            <p className="text-base-content whitespace-pre-wrap">{contact.message}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-base-content/70">
                            Submitted on {new Date(contact.created_at).toLocaleDateString()} at{' '}
                            {new Date(contact.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}