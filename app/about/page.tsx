import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-base-content mb-6">
            Pool Bean Bags
          </h1>
          <p className="text-2xl font-semibold text-primary mb-4">
            Splashing Good Fun
          </p>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Premium, UV-resistant pool beanbags designed for lazy days and stylish decks.
            Built for SA sun. Made to last.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Our Product */}
        <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
          <h2 className="text-3xl font-bold text-base-content mb-8 text-center">About Our Product</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p className="text-base-content/80 text-lg">100% polyester UV resistant outer cover fitted with a zip</p>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p className="text-base-content/80 text-lg">Inner bag filled with recycled polystyrene balls</p>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p className="text-base-content/80 text-lg">Measurements 1.4m x 1.1m</p>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p className="text-base-content/80 text-lg">1 week lead time from date of payment</p>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p className="text-base-content/80 text-lg">Bags are made to order</p>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p className="text-base-content/80 text-lg">Variety of funky fabrics to choose from</p>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p className="text-base-content/80 text-lg">Made in Durban, RSA</p>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <p className="text-base-content/80 text-lg">Can be couriered all areas in SA</p>
            </div>
          </div>
        </Card>

        {/* Why Choose Us */}
        <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
          <h2 className="text-3xl font-bold text-base-content mb-6 text-center">Why Choose Pool Beanbags?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">☀️</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">UV Resistant</h3>
              <p className="text-base-content/70">Built to withstand South African sun</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Eco-Friendly</h3>
              <p className="text-base-content/70">Filled with recycled polystyrene balls</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Custom Fabrics</h3>
              <p className="text-base-content/70">Choose from our variety of funky fabrics</p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Nationwide Delivery</h3>
              <p className="text-base-content/70">Delivered anywhere in South Africa</p>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-base-content mb-4">Ready to Float?</h2>
          <p className="text-base-content/70 mb-8 text-lg">
            Transform your pool area with our premium beanbags today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <Button className="btn btn-primary btn-lg">
                Shop Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="btn btn-outline btn-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}