"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../../components/ui/Button';
import Card from '../../../../components/ui/Card';
import { API_BASE } from 'lib/api';

export default function AddProductPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    base_price_cents: 0,
    is_promotional: false,
    promotion_text: '',
    promotion_discount_percent: 0,
    status: 'active',
    seo_title: '',
    seo_description: ''
  });
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      if (data.user?.role !== 'admin') {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }

      setAuthLoading(false);
    } catch (err) {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Create product
      const productRes = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!productRes.ok) {
        const errorData = await productRes.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const product = await productRes.json();
      setSuccess('Product created successfully!');

      // Add image if provided
      if (imageUrl) {
        try {
          await fetch(`${API_BASE}/api/admin/products/${product._id}/images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({
              url: imageUrl,
              alt: imageAlt || product.title,
              sort: 0
            })
          });
        } catch (imgErr) {
          console.error('Failed to add image:', imgErr);
        }
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
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
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/admin/products')}
            className="text-primary hover:text-primary-focus font-medium mb-4"
          >
            ← Back to Products
          </Button>
          <h1 className="text-4xl font-bold text-base-content mb-2">Add New Product</h1>
          <p className="text-lg text-base-content/70">Create a new pool beanbag product</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="p-8">
            {error && (
              <div className="alert alert-error mb-6">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success mb-6">
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-xl font-semibold text-base-content mb-4">Basic Information</h3>
                
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Product Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Classic Pool Beanbag - Ocean Blue"
                    className="input input-bordered"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Slug (URL-friendly) *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., classic-pool-beanbag-blue"
                    className="input input-bordered"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                  </label>
                  <textarea
                    placeholder="Product description..."
                    className="textarea textarea-bordered"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-xl font-semibold text-base-content mb-4">Pricing</h3>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Price (in cents) *</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 89900 for R899.00"
                    className="input input-bordered"
                    value={formData.base_price_cents}
                    onChange={(e) => setFormData({ ...formData, base_price_cents: parseInt(e.target.value) })}
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt">Enter amount in cents (e.g., 899.00 = 89900)</span>
                  </label>
                </div>
              </div>

              {/* Promotion */}
              <div>
                <h3 className="text-xl font-semibold text-base-content mb-4">Promotion</h3>

                <div className="form-control mb-4">
                  <label className="label cursor-pointer">
                    <span className="label-text font-medium">Mark as Promotional</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={formData.is_promotional}
                      onChange={(e) => setFormData({ ...formData, is_promotional: e.target.checked })}
                    />
                  </label>
                </div>

                {formData.is_promotional && (
                  <>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text font-medium">Promotion Text</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Summer Special!"
                        className="input input-bordered"
                        value={formData.promotion_text}
                        onChange={(e) => setFormData({ ...formData, promotion_text: e.target.value })}
                      />
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text font-medium">Discount Percentage</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 15"
                        className="input input-bordered"
                        value={formData.promotion_discount_percent}
                        onChange={(e) => setFormData({ ...formData, promotion_discount_percent: parseInt(e.target.value) })}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Image */}
              <div>
                <h3 className="text-xl font-semibold text-base-content mb-4">Image</h3>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Image URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="e.g., https://res.cloudinary.com/..."
                    className="input input-bordered"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Image Alt Text</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Classic Pool Beanbag in Ocean Blue"
                    className="input input-bordered"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                  />
                </div>
              </div>

              {/* SEO */}
              <div>
                <h3 className="text-xl font-semibold text-base-content mb-4">SEO</h3>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">SEO Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="SEO page title..."
                    className="input input-bordered"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">SEO Description</span>
                  </label>
                  <textarea
                    placeholder="SEO description..."
                    className="textarea textarea-bordered"
                    rows={3}
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-xl font-semibold text-base-content mb-4">Status</h3>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Product Status</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn btn-primary"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push('/admin/products')}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
