"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

type ShippingOrder = {
  id: number;
  order_id: number;
  customer_name: string;
  shipping_address: string;
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered';
  tracking_number?: string;
  carrier?: string;
  estimated_delivery?: string;
  created_at: string;
};

export default function AdminShippingPage() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null);

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
    loadShippingOrders();
  }

  async function loadShippingOrders() {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/api/admin/orders`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      const allOrders = data.orders || [];

      const shipping = allOrders
        .filter((o: any) => o.delivery && o.delivery.delivery_method === 'shipping')
        .map((o: any) => {
            const delivery = o.delivery || {};
            // Prefer resolved shippingAddress on delivery, fallback to top-level shippingAddress or notes
            const addr = delivery.shippingAddress || o.shippingAddress;
            const parts: string[] = [];
            if (addr) {
              if (addr.firstName || addr.lastName) parts.push(`${(addr.firstName || '')} ${(addr.lastName || '')}`.trim());
              if (addr.addressLine1) parts.push(addr.addressLine1);
              if (addr.addressLine2) parts.push(addr.addressLine2);
              const cityState = [addr.city, addr.state].filter(Boolean).join(', ');
              if (cityState) parts.push(cityState);
              if (addr.postalCode) parts.push(addr.postalCode);
              if (addr.country) parts.push(addr.country);
            }
            const shippingAddressStr = parts.length ? parts.join(', ') : (delivery.notes || '');

          const rawStatus = delivery.delivery_status || 'pending';
          const status = rawStatus === 'pending' ? 'preparing' : (rawStatus === 'shipped' ? 'shipped' : (rawStatus === 'in_transit' ? 'in_transit' : (rawStatus === 'delivered' ? 'delivered' : rawStatus)));

          return {
            id: o.id,
            order_id: o.orderNo,
            customer_name: o.customer ? o.customer.name : (o.email || 'Guest'),
            shipping_address: shippingAddressStr,
            status,
            tracking_number: delivery?.tracking_number || undefined,
            carrier: undefined,
            estimated_delivery: undefined,
            created_at: o.createdAt
          } as ShippingOrder;
        });

      setShippingOrders(shipping);
    } catch (err) {
      console.error('Error loading shipping orders:', err);
      setShippingOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateShippingStatus(orderId: number, newStatus: ShippingOrder['status']) {
    try {
      const token = localStorage.getItem('admin_token');
      const payload = { deliveryStatus: newStatus };
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/delivery`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update delivery status');

      // refresh list after update
      await loadShippingOrders();
    } catch (err) {
      console.error('Error updating shipping status:', err);
    }
  }

  // Poll for shipping orders every 10s once auth check completes
  useEffect(() => {
    if (authLoading) return;
    loadShippingOrders();
    const interval = setInterval(() => {
      loadShippingOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, [authLoading]);

  function addTrackingInfo(order: ShippingOrder) {
    // TODO: Implement tracking info modal/form
    console.log('Adding tracking info for order:', order.id);
    alert('Tracking info form not yet implemented');
  }

  function getStatusBadgeColor(status: ShippingOrder['status']) {
    switch (status) {
      case 'preparing': return 'badge-warning';
      case 'shipped': return 'badge-info';
      case 'in_transit': return 'badge-primary';
      case 'delivered': return 'badge-success';
      default: return 'badge-neutral';
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
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-base-content mb-2">Shipping Management</h1>
              <p className="text-lg text-base-content/70">Track and manage order shipments</p>
            </div>
            <Button
              onClick={() => router.push('/admin')}
              className="bg-base-300 hover:bg-base-400 text-base-content font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Shipping Orders List */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-base-content">Shipping Orders</h2>
              <Badge className="badge-primary badge-lg font-semibold">
                {shippingOrders.length} {shippingOrders.length === 1 ? 'Order' : 'Orders'}
              </Badge>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-base-content/70">Loading shipping orders...</p>
              </div>
            ) : shippingOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">No shipping orders yet</h3>
                <p className="text-base-content/70">Shipping orders will appear here once orders are processed</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Shipping Address</th>
                      <th>Status</th>
                      <th>Tracking</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippingOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="font-medium">#{order.order_id}</td>
                        <td className="font-medium">{order.customer_name}</td>
                        <td className="max-w-xs truncate" title={order.shipping_address}>
                          {order.shipping_address}
                        </td>
                        <td>
                          <Badge className={`badge ${getStatusBadgeColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td>
                          {order.tracking_number ? (
                            <div>
                              <p className="font-medium">{order.carrier}</p>
                              <p className="text-sm text-base-content/70">{order.tracking_number}</p>
                            </div>
                          ) : (
                            <span className="text-base-content/50">Not set</span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setSelectedOrder(order)}
                              className="btn btn-sm btn-outline"
                            >
                              View
                            </Button>
                            <Button
                              onClick={() => addTrackingInfo(order)}
                              className="btn btn-sm btn-primary"
                            >
                              Track
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        {/* Shipping Details Modal */}
        {selectedOrder && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg mb-4">Shipping Details - Order #{selectedOrder.order_id}</h3>

              <div className="space-y-4">
                {/* Customer & Address Info */}
                <div className="bg-base-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Shipping Information</h4>
                  <p><strong>Customer:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Address:</strong> {selectedOrder.shipping_address}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>

                {/* Tracking Info */}
                <div className="bg-base-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Tracking Information</h4>
                  {selectedOrder.tracking_number ? (
                    <div>
                      <p><strong>Carrier:</strong> {selectedOrder.carrier}</p>
                      <p><strong>Tracking Number:</strong> {selectedOrder.tracking_number}</p>
                      {selectedOrder.estimated_delivery && (
                        <p><strong>Estimated Delivery:</strong> {new Date(selectedOrder.estimated_delivery).toLocaleDateString()}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-base-content/70">No tracking information available</p>
                  )}
                </div>

                {/* Status Update */}
                <div className="bg-base-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Update Shipping Status</h4>
                  <div className="flex gap-2 flex-wrap">
                    {(['preparing', 'shipped', 'in_transit', 'delivered'] as const).map((status) => (
                      <Button
                        key={status}
                        onClick={() => updateShippingStatus(selectedOrder.id, status)}
                        className={`btn btn-sm ${
                          selectedOrder.status === status ? 'btn-primary' : 'btn-outline'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-action">
                <Button onClick={() => setSelectedOrder(null)} className="btn">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}