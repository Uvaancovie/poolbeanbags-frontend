"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Card from '../../../components/ui/Card';
import { API_BASE } from 'lib/api';

export default function AddProductPage() {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPromotional, setIsPromotional] = useState(false);
  const [promotionText, setPromotionText] = useState('');
  const [promotionDiscountPercent, setPromotionDiscountPercent] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let res: Response;
      if (imageFile) {
        const fd = new FormData();
        fd.append('slug', slug);
        fd.append('title', title);
        fd.append('description', description);
        fd.append('base_price_cents', String(Math.round((parseFloat(price || '0') || 0) * 100)));
        fd.append('is_promotional', String(isPromotional));
        if (promotionText) fd.append('promotion_text', promotionText);
        if (promotionDiscountPercent) fd.append('promotion_discount_percent', promotionDiscountPercent);
        fd.append('image', imageFile, imageFile.name);
        res = await fetch(`${API_BASE}/api/products`, { method: 'POST', body: fd });
      } else {
        const body = {
          slug,
          title,
          description,
          base_price_cents: Math.round((parseFloat(price || '0') || 0) * 100),
          is_promotional: isPromotional,
          promotion_text: promotionText || undefined,
          promotion_discount_percent: promotionDiscountPercent ? Number(promotionDiscountPercent) : undefined
        };
        res = await fetch(`${API_BASE}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err?.error || 'Failed to create product');
      } else {
        router.push('/shop');
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">Add New Product</h1>
          <p className="text-lg text-base-content/70 max-w-xl mx-auto">Create a new product listing for your pool beanbag collection.</p>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content">Product Title *</label>
              <Input
                aria-label="Product title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="e.g., Premium Outdoor Beanbag"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content">URL Slug *</label>
              <Input
                aria-label="Product slug"
                value={slug}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
                placeholder="e.g., premium-outdoor-beanbag"
                className="w-full"
                required
              />
              <p className="text-xs text-base-content/50">Used in product URLs. Lowercase, hyphens only.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content">Description</label>
              <Textarea
                aria-label="Product description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Describe your product in detail..."
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
                  required
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
                      aria-label="Promotion text"
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
              <label className="text-sm font-medium text-base-content">Product Image</label>
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
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary-focus text-primary-content font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push('/shop')}
                className="px-6 py-3 border-2 border-base-300 hover:border-base-400 rounded-lg transition-colors"
              >
                Cancel
              </Button>
            </div>

            {error && (
              <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"></path>
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}