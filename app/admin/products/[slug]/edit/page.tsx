"use client";

import { useEffect, useState, use } from 'react';
import { API_BASE } from 'lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';
import Textarea from '../../../../../components/ui/Textarea';
import Card from '../../../../../components/ui/Card';

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // promotional fields have been removed from the edit form

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
    loadProduct();
  }

  async function loadProduct() {
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}`);
    const json = await res.json();
    const data = json?.product || json || null; // unwrap product if backend returns { product: ... }
    setProduct(data);
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
      setPrice((((data.base_price_cents || 0) / 100)).toFixed(2));
      // no longer set promotional properties here
      if (data.images && data.images.length > 0) {
        setImagePreview(data.images[0].url);
      }
    }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('admin_token');
    
    const body = {
      title,
      description,
      base_price_cents: Math.round((parseFloat(price || '0') || 0) * 100)
    };

    const res = await fetch(`${API_BASE}/api/admin/products/${product._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    setSaving(false);
    if (res.ok) {
      alert('Product updated!');
      router.push('/admin/products');
    } else {
      alert('Failed to update');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg text-base-content/70">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-base-content mb-2">Product Not Found</h2>
          <p className="text-base-content/60 mb-6">The product you're looking for doesn't exist.</p>
          <a href="/shop" className="btn btn-primary">Back to Shop</a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
                {/* promotional fields removed from edit form */}
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content">Product Title</label>
                  <Input
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    placeholder="Enter product title"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    placeholder="Describe your product..."
                    className="w-full min-h-[120px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content">Price (ZAR)</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-base-content bg-base-200 border border-r-0 border-base-300 rounded-l-md">R</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="rounded-l-none border-l-0"
                    />
                  </div>
                </div>

                {/* promotional fields removed from edit form */}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content">Replace Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const f = e.target.files?.[0] || null;
                        setImageFile(f);
                        if (f) setImagePreview(URL.createObjectURL(f)); else setImagePreview(null);
                      }}
                      className="file-input file-input-bordered w-full file-input-primary"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative group">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Preview</span>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-base-content/50">Leave empty to keep the current image</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary hover:bg-primary-focus text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {saving ? (
                      <>
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <a
                    href="/shop"
                    className="btn btn-outline px-6 py-3 border-2 border-base-300 hover:border-base-400 rounded-lg transition-colors"
                  >
                    Back to Shop
                  </a>
                </div>
              </form>
      </div>
    </div>
  );
}
