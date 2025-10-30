import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero Section */}
      <div className="bg-[var(--primary)] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-light text-[var(--primary-foreground)] mb-6">
            Pool Bean Bags
          </h1>
          <p className="text-2xl text-[var(--primary-foreground)]/95 max-w-2xl mx-auto leading-relaxed font-light">
            Premium, UV-resistant pool beanbags designed for lazy days and stylish decks.
            Built for SA sun. Made to last.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Our Product */}
        <div className="p-10 shadow-xl border border-[var(--border)] bg-[var(--card)] rounded-2xl mb-8">
          <h2 className="text-4xl font-light text-[var(--fg)] mb-10 text-center">
            About Our Product
          </h2>

          <div className="space-y-4">
            <p className="text-[var(--fg-muted)] text-lg font-light">100% polyester UV resistant outer cover fitted with a zip</p>
            <p className="text-[var(--fg-muted)] text-lg font-light">Inner bag filled with recycled polystyrene balls</p>
            <p className="text-[var(--fg-muted)] text-lg font-light">Measurements 1.4m x 1.1m - Perfect poolside size</p>
            <p className="text-[var(--fg-muted)] text-lg font-light">1 week lead time from date of payment</p>
            <p className="text-[var(--fg-muted)] text-lg font-light">Bags are made to order - Custom for you</p>
            <p className="text-[var(--fg-muted)] text-lg font-light">Variety of fabrics to choose from</p>
            <p className="text-[var(--fg-muted)] text-lg font-light">Made in Durban, RSA - Local pride</p>
            <p className="text-[var(--fg-muted)] text-lg font-light">Can be couriered all areas in SA</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="p-10 shadow-xl border border-[var(--border)] bg-[var(--card)] rounded-2xl mb-8">
          <h2 className="text-4xl font-light text-[var(--fg)] mb-10 text-center">
            Why Choose Pool Beanbags?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center p-6 border border-[var(--border)] bg-[var(--secondary)] rounded-2xl">
              <h3 className="text-2xl font-light text-[var(--fg)] mb-3">UV Resistant</h3>
              <p className="text-[var(--fg-muted)] font-light">Built to withstand South African sun</p>
            </div>

            <div className="text-center p-6 border border-[var(--border)] bg-[var(--secondary)] rounded-2xl">
              <h3 className="text-2xl font-light text-[var(--fg)] mb-3">Eco-Friendly</h3>
              <p className="text-[var(--fg-muted)] font-light">Filled with recycled polystyrene balls</p>
            </div>

            <div className="text-center p-6 border border-[var(--border)] bg-[var(--secondary)] rounded-2xl">
              <h3 className="text-2xl font-light text-[var(--fg)] mb-3">Custom Fabrics</h3>
              <p className="text-[var(--fg-muted)] font-light">Choose from our variety of fabrics</p>
            </div>

            <div className="text-center p-6 border border-[var(--border)] bg-[var(--secondary)] rounded-2xl">
              <h3 className="text-2xl font-light text-[var(--fg)] mb-3">Nationwide Delivery</h3>
              <p className="text-[var(--fg-muted)] font-light">Delivered anywhere in South Africa</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-light text-[var(--fg)] mb-4">Ready to Float?</h2>
          <p className="text-[var(--fg-muted)] mb-8 text-lg">
            Transform your pool area with our premium beanbags today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/shop" className="btn-primary">
              Shop Now
            </a>
            <a href="/contact" className="px-8 py-4 border-2 border-[var(--border)] bg-[var(--secondary)] text-[var(--fg)] rounded-lg hover:bg-[var(--muted)] transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}