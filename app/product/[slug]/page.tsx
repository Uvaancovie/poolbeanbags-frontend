"use client";

import { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import { formatPriceFromCents } from '../../../lib/formatPrice';
import { Button } from '../../../components/ui/Button';
import { API_BASE } from 'lib/api';
import { useCart } from '../../../components/CartContext';

type Product = {
  _id?: string;
  id: string;
  slug: string;
  title: string;
  description?: string;
  base_price_cents?: number;
  images?: { _id?: string; id?: string; url: string; alt: string }[];
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(params.slug)}`, { 
          next: { revalidate: 120 } // ISR: cache for 2 minutes, then revalidate
        });
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        const prod: Product = data.product || data;
        setProduct(prod);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-base-content mb-2">Product Not Found</h2>
          <p className="text-base-content/60 mb-6">The product you're looking for doesn't exist.</p>
          <a href="/shop" className="btn btn-primary text-white">Back to Shop</a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <a href="/shop" className="btn btn-ghost mb-4 text-white">
            ← Back to Shop
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-2xl bg-white/90 backdrop-blur-sm border-0">
              <figure className="relative h-96 lg:h-[500px] bg-gradient-to-br from-base-200 to-base-300">
                {product.images && product.images.length ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt || product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-base-content/30">
                    📷
                  </div>
                )}
              </figure>
            </Card>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-base-content mb-4">{product.title}</h1>
              <div className="text-3xl font-bold text-primary mb-6">
                {formatPriceFromCents(product.base_price_cents || 0)}
              </div>
              <div className="text-base-content/70 text-lg leading-relaxed">
                {product.description || 'No description available for this product.'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-base-content/60">
                <span>Product ID: {product._id || product.id}</span>
                <span>•</span>
                <span>Slug: {product.slug}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button onClick={() => addItem(product)} className="flex-1 bg-primary hover:bg-primary-focus text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg">
                Add to Cart
              </Button>
              <Button variant="outline" className="px-8 py-4 border-2 border-base-300 hover:border-base-400 rounded-lg transition-colors text-lg text-white">
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
