'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('m_payment_id');
  const amount = searchParams.get('amount_gross');

  return (
    <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-600 mb-2">
        Thank you for your order. Your payment has been processed successfully.
      </p>
      {orderNumber && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
          <p className="text-sm text-gray-700 mb-1">Order Number:</p>
          <p className="text-xl font-mono font-semibold text-green-700">{orderNumber}</p>
          {amount && (
            <p className="text-sm text-gray-600 mt-2">Amount: R{parseFloat(amount).toFixed(2)}</p>
          )}
        </div>
      )}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6 text-left">
        <h2 className="font-semibold text-lg mb-3">What happens next?</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">📧</span>
            <span>You'll receive an order confirmation email shortly</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">📦</span>
            <span>We'll process and ship your order within 1-2 business days</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🚚</span>
            <span>You'll receive tracking information once shipped</span>
          </li>
        </ul>
      </div>
      <p className="text-gray-600 mb-8">
        If you have any questions about your order, please contact us at{' '}
        <a href="mailto:support@poolbeanbags.co.za" className="text-blue-600 hover:underline">
          support@poolbeanbags.co.za
        </a>
      </p>
      <div className="space-x-4">
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
        >
          Continue Shopping
        </Link>
        <Link
          href="/products"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors"
        >
          View Products
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <Suspense fallback={
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
