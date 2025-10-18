"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { API_BASE } from 'lib/api';

type Product = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  base_price_cents?: number;
  is_promotional?: boolean;
  promotion_text?: string;
  promotion_discount_percent?: number;
  status: string;
  images?: { id: number; url: string; alt: string }[];
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

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
    loadProducts();
  }

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }

  async function togglePromotion(productId: number, isPromotional: boolean) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_promotional: isPromotional })
      });
      if (res.ok) {
        loadProducts(); // Refresh the list
      } else {
        console.error('Failed to toggle promotion');
      }
    } catch (err) {
      console.error('Error toggling promotion:', err);
    }
  }

  async function deleteProduct(productId: number) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadProducts(); // Refresh the list
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error deleting product');
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
              <h1 className="text-4xl font-bold text-base-content mb-2">Product Management</h1>
              <p className="text-lg text-base-content/70">Manage your pool beanbag products</p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/shop/add')}
                className="bg-primary hover:bg-primary-focus text-primary-content font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                + Add Product
              </Button>
              <Button
                onClick={() => router.push('/admin')}
                className="bg-base-300 hover:bg-base-400 text-base-content font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Products List */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-base-content">All Products</h2>
              <Badge className="badge-primary badge-lg font-semibold">
                {products.length} {products.length === 1 ? 'Product' : 'Products'}
              </Badge>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-base-content/70">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">No products yet</h3>
                <p className="text-base-content/70 mb-4">Create your first product to get started</p>
                <Button
                  onClick={() => router.push('/shop/add')}
                  className="bg-primary hover:bg-primary-focus text-primary-content font-medium py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="shadow-lg border-0 bg-base-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {/* Product Image */}
                    <div className="aspect-square bg-base-200 relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🏊
                        </div>
                      )}
                      {product.is_promotional && (
                        <Badge className="badge-error badge-sm absolute top-3 left-3 font-semibold">
                          SALE
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-base-content mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-lg font-bold text-base-content">
                          ${(product.base_price_cents || 0) / 100}
                        </span>
                        {product.is_promotional && product.promotion_discount_percent && (
                          <span className="text-sm text-error ml-2">
                            ({product.promotion_discount_percent}% off)
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="mb-4">
                        <Badge className={`badge ${
                          product.status === 'published' ? 'badge-success' :
                          product.status === 'draft' ? 'badge-warning' : 'badge-neutral'
                        }`}>
                          {product.status}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => router.push(`/admin/products/${product.slug}/edit`)}
                          className="flex-1 btn btn-sm btn-outline"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => togglePromotion(product.id, !product.is_promotional)}
                          className={`btn btn-sm ${product.is_promotional ? 'btn-error' : 'btn-warning'}`}
                          title={product.is_promotional ? 'Remove promotion' : 'Mark as promotional'}
                        >
                          {product.is_promotional ? '★' : '☆'}
                        </Button>
                        <Button
                          onClick={() => deleteProduct(product.id)}
                          className="btn btn-sm btn-error"
                          title="Delete product"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}