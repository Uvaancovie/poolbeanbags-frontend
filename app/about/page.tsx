import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-pink-500 to-green-500 py-20 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            🏊 Pool Bean Bags
          </h1>
          <p className="text-3xl font-bold text-yellow-300 mb-4 drop-shadow-lg">
            💦 Splashing Good Fun!
          </p>
          <p className="text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed font-medium">
            Premium, UV-resistant pool beanbags designed for lazy days and stylish decks.
            Built for SA sun. Made to last. 🌞
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Our Product */}
        <Card className="p-10 shadow-2xl border-t-8 border-blue-600 bg-white rounded-2xl mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center flex items-center justify-center gap-3">
            <span className="text-5xl">🎯</span> About Our Product
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <p className="text-gray-700 text-lg font-medium">✨ 100% polyester UV resistant outer cover fitted with a zip</p>
            </div>

            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <p className="text-gray-700 text-lg font-medium">♻️ Inner bag filled with recycled polystyrene balls</p>
            </div>

            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform">
              <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <p className="text-gray-700 text-lg font-medium">📏 Measurements 1.4m x 1.1m - Perfect poolside size!</p>
            </div>

            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <p className="text-gray-700 text-lg font-medium">⏱️ 1 week lead time from date of payment</p>
            </div>

            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <p className="text-gray-700 text-lg font-medium">✅ Bags are made to order - Custom for you!</p>
            </div>

            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform">
              <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-red-600 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <p className="text-gray-700 text-lg font-medium">🎨 Variety of funky fabrics to choose from</p>
            </div>

            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <p className="text-gray-700 text-lg font-medium">🇿🇦 Made in Durban, RSA - Local pride!</p>
            </div>

            <div className="flex items-start gap-4 hover:translate-x-2 transition-transform">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <p className="text-gray-700 text-lg font-medium">🚚 Can be couriered all areas in SA</p>
            </div>
          </div>
        </Card>

        {/* Why Choose Us */}
        <Card className="p-10 shadow-2xl border-t-8 border-pink-500 bg-white rounded-2xl mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center flex items-center justify-center gap-3">
            <span className="text-5xl">🌟</span> Why Choose Pool Beanbags?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border-4 border-yellow-400 hover:scale-105 transition-transform shadow-lg">
              <div className="text-6xl mb-4">☀️</div>
              <h3 className="text-2xl font-bold text-yellow-700 mb-3">UV Resistant</h3>
              <p className="text-gray-700 font-medium">Built to withstand South African sun 🌞</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-4 border-green-400 hover:scale-105 transition-transform shadow-lg">
              <div className="text-6xl mb-4">♻️</div>
              <h3 className="text-2xl font-bold text-green-700 mb-3">Eco-Friendly</h3>
              <p className="text-gray-700 font-medium">Filled with recycled polystyrene balls 🌍</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl border-4 border-pink-400 hover:scale-105 transition-transform shadow-lg">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-pink-700 mb-3">Custom Fabrics</h3>
              <p className="text-gray-700 font-medium">Choose from our variety of funky fabrics ✨</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-4 border-blue-400 hover:scale-105 transition-transform shadow-lg">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-blue-700 mb-3">Nationwide Delivery</h3>
              <p className="text-gray-700 font-medium">Delivered anywhere in South Africa 🇿🇦</p>
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