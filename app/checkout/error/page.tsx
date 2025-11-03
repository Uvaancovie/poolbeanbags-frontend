"use client";

import Link from 'next/link';

export default function CheckoutErrorPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <div className="text-6xl mb-4">⚠</div>
          <h1 className="poppins-light text-[28px] mb-2 text-[var(--fg)]">Payment Error</h1>
          <p className="text-[var(--fg-muted)] mb-6">
            There was an error processing your payment. Please try again or contact support if the problem persists.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/cart"
              className="block w-full h-12 rounded-lg border border-black bg-black text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center font-medium"
            >
              Return to Cart
            </Link>
            <Link
              href="/"
              className="block w-full h-12 rounded-lg border border-black bg-white text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center font-medium"
            >
              Return to Home
            </Link>
          </div>
          
          <p className="text-xs text-[var(--fg-muted)] mt-6">
            Need help? Contact us at support@poolbeanbags.co.za
          </p>
        </div>
      </div>
    </div>
  );
}
