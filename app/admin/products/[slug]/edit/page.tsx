"use client";

import { useEffect, useState, use } from 'react';
import { API_BASE } from 'lib/api';
import { useRouter } from 'next/navigation';
import Button from '../../../../../components/ui/Button';
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
  const [isPromotional, setIsPromotional] = useState(false);
  const [promotionText, setPromotionText] = useState('');
  const [promotionDiscountPercent, setPromotionDiscountPercent] = useState('');

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
    const data = await res.json();
    setProduct(data); // API returns product directly, not wrapped
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
      setPrice(((data.base_price_cents || 0) / 100).toFixed(2));
      setIsPromotional(!!data.is_promotional);
      setPromotionText(data.promotion_text || '');
      setPromotionDiscountPercent(data.promotion_discount_percent ? String(data.promotion_discount_percent) : '');
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
      base_price_cents: Math.round((parseFloat(price || '0') || 0) * 100),
      is_promotional: isPromotional,
      promotion_text: promotionText || undefined,
      promotion_discount_percent: promotionDiscountPercent ? Number(promotionDiscountPercent) : undefined
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">Edit Product</h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">Update your product details, pricing, and images to keep your storefront current.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Product Preview */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-base-content mb-4">Current Product</h2>
              <div className="space-y-4">
                <div className="relative h-48 bg-gradient-to-br from-base-200 to-base-300 rounded-lg overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-base-content/30">
                      📷
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-base-content">{product.title}</h3>
                  <p className="text-base-content/70 text-sm mt-1">{product.description || 'No description'}</p>
                  <p className="text-primary font-semibold text-lg mt-2">
                    R{((product.base_price_cents || 0) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-1">
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-base-content mb-2">Update Details</h2>
                <p className="text-sm text-base-content/60">Make changes to your product information below.</p>
              </div>

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

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPromotional"
                      checked={isPromotional}
                      onChange={(e) => setIsPromotional(e.target.checked)}
                      className="checkbox checkbox-primary"
                    />
                    <label htmlFor="isPromotional" className="text-sm font-medium text-base-content">
                      Mark as Promotional
                    </label>
                  </div>

                  {isPromotional && (
                    <div className="space-y-3 pl-7 border-l-2 border-primary/20">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content">Promotion Text</label>
                        <Input
                          value={promotionText}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromotionText(e.target.value)}
                          placeholder="e.g., Limited Time Offer!"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-base-content">Discount Percentage</label>
                        <div className="flex">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={promotionDiscountPercent}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromotionDiscountPercent(e.target.value)}
                            placeholder="20"
                            className="rounded-r-none border-r-0"
                          />
                          <span className="inline-flex items-center px-3 text-sm text-base-content bg-base-200 border border-l-0 border-base-300 rounded-r-md">%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-base-content">Replace Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const f = e.target.files?.[0] || null;
                        setImageFile(f);
                        if (f) setImagePreview(URL.createObjectURL(f));
                      }}
                      className="file-input file-input-bordered w-full file-input-primary"
                    />
                  </div>
                  <p className="text-xs text-base-content/50">Leave empty to keep the current image</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary hover:bg-primary-focus text-primary-content font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
