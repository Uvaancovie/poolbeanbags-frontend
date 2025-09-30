import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

type Product = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  base_price_cents?: number;
  images?: { id: number; url: string; alt: string }[];
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  try {
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) {
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
    const data = await res.json();
    const prod: Product = data.product;

    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <a href="/shop" className="btn btn-ghost mb-4">
              ← Back to Shop
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden shadow-2xl bg-white/90 backdrop-blur-sm border-0">
                <figure className="relative h-96 lg:h-[500px] bg-gradient-to-br from-base-200 to-base-300">
                  {prod.images && prod.images.length ? (
                    <img
                      src={prod.images[0].url}
                      alt={prod.images[0].alt || prod.title}
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
                <h1 className="text-4xl lg:text-5xl font-bold text-base-content mb-4">{prod.title}</h1>
                <div className="text-3xl font-bold text-primary mb-6">
                  R{((prod.base_price_cents || 0) / 100).toFixed(2)}
                </div>
                <div className="text-base-content/70 text-lg leading-relaxed">
                  {prod.description || 'No description available for this product.'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-base-content/60">
                  <span>Product ID: {prod.id}</span>
                  <span>•</span>
                  <span>Slug: {prod.slug}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button className="flex-1 bg-primary hover:bg-primary-focus text-primary-content font-medium py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg">
                  Add to Cart
                </Button>
                <Button variant="outline" className="px-8 py-4 border-2 border-base-300 hover:border-base-400 rounded-lg transition-colors text-lg">
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-base-content mb-2">Error Loading Product</h2>
          <p className="text-base-content/60 mb-6">Something went wrong while loading this product.</p>
          <a href="/shop" className="btn btn-primary">Back to Shop</a>
        </Card>
      </div>
    );
  }
}
