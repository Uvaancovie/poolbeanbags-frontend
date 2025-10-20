'use client';

import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your payment was not completed. Don't worry - no charges were made to your account.
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 my-6 text-left">
          <h2 className="font-semibold text-lg mb-3">What would you like to do?</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">🔄</span>
              <span>Try completing your purchase again</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🛒</span>
              <span>Continue shopping for more products</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">💬</span>
              <span>Contact us if you're experiencing issues with payment</span>
            </li>
          </ul>
        </div>

        <p className="text-gray-600 mb-8">
          Need help? Contact us at{' '}
          <a href="mailto:support@poolbeanbags.co.za" className="text-blue-600 hover:underline">
            support@poolbeanbags.co.za
          </a>
        </p>

        <div className="space-x-4">
          <Link
            href="/checkout/payfast"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Your shopping cart items are still saved. You can resume your purchase at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
