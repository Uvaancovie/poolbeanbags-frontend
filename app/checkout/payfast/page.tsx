'use client';

import { useState, useEffect } from 'react';
import { apiPost } from '../../../lib/api';
import Link from 'next/link';

interface CartItem {
  productId: string;
  variant?: any;
  qty: number;
  priceAtPurchase: number;
  name: string;
}

interface ShippingOption {
  code: string;
  name: string;
  price: number;
  etaDays: string;
}

export default function PayfastCheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [calculating, setCalculating] = useState(false);
  
  // Form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [outOfArea, setOutOfArea] = useState(false);

  // Mock cart - replace with actual cart from context/state/localStorage
  const [cart] = useState<CartItem[]>([
    {
      productId: '507f1f77bcf86cd799439011',
      name: 'Pool Beanbag - Blue',
      qty: 2,
      priceAtPurchase: 599,
      variant: { color: 'Blue' }
    }
  ]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.priceAtPurchase * item.qty), 0);

  // Fetch shipping quote when address changes
  useEffect(() => {
    if (city && province && postalCode) {
      fetchShippingQuote();
    }
  }, [city, province, postalCode, outOfArea]);

  async function fetchShippingQuote() {
    setCalculating(true);
    try {
      const response = await apiPost<{ options: ShippingOption[] }>('/api/shipping/quote', {
        cartTotal,
        destination: { city, province, postalCode },
        outOfArea
      });
      setShippingOptions(response.options);
      if (response.options.length > 0) {
        setSelectedShipping(response.options[0]);
      }
    } catch (error) {
      console.error('Failed to fetch shipping quote:', error);
      alert('Failed to calculate shipping. Please try again.');
    } finally {
      setCalculating(false);
    }
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedShipping) {
      alert('Please wait for shipping calculation');
      return;
    }

    if (!contactName || !contactEmail || !phone) {
      alert('Please fill in all contact information');
      return;
    }

    setLoading(true);

    try {
      const response = await apiPost<{ redirect: string; orderNumber: string }>('/api/checkout', {
        items: cart,
        shippingAddress: {
          name: contactName,
          phone,
          address1,
          address2,
          city,
          province,
          postalCode
        },
        shippingOption: selectedShipping,
        contactEmail,
        contactName
      });

      console.log('Order created:', response.orderNumber);
      
      // Redirect to PayFast payment page
      window.location.href = response.redirect;
    } catch (error: any) {
      alert(`Checkout failed: ${error.message}`);
      setLoading(false);
    }
  }

  const grandTotal = cartTotal + (selectedShipping?.price || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <Link 
              href="/" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address *"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Apartment, Suite, etc. (Optional)"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select Province *</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Free State">Free State</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Northern Cape">Northern Cape</option>
                    <option value="North West">North West</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Postal Code *"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={outOfArea}
                    onChange={(e) => setOutOfArea(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Out of Area Delivery <span className="text-gray-500">(+R70 surcharge)</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Shipping Options */}
            {calculating && (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-gray-600">Calculating shipping...</p>
              </div>
            )}

            {!calculating && shippingOptions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Shipping Method</h2>
                {shippingOptions.map((option) => (
                  <div key={option.code} className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{option.name}</p>
                        <p className="text-sm text-gray-600">
                          Estimated delivery: {option.etaDays} business days
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {option.price === 0 ? 'FREE' : `R${option.price}`}
                      </p>
                    </div>
                  </div>
                ))}
                {cartTotal >= 1499 && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    🎉 You qualify for FREE SHIPPING!
                  </p>
                )}
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-200">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                    </div>
                    <span className="font-medium">R{(item.priceAtPurchase * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              {/* Pricing Breakdown */}
              <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-900">R{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-2 bg-blue-50 -mx-6 px-6 rounded-lg">
                  <div>
                    <span className="text-gray-700 font-medium">Shipping:</span>
                    {selectedShipping && (
                      <p className="text-xs text-gray-600 mt-1">
                        {selectedShipping.name} • {selectedShipping.etaDays} business days
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-lg">
                    {calculating ? (
                      <span className="text-sm text-gray-500">Calculating...</span>
                    ) : selectedShipping?.price === 0 ? (
                      <span className="text-green-600 font-bold">FREE 🎉</span>
                    ) : selectedShipping ? (
                      <span className="text-blue-600">R{selectedShipping.price.toFixed(2)}</span>
                    ) : (
                      <span className="text-sm text-gray-500">Enter address</span>
                    )}
                  </span>
                </div>

                {cartTotal >= 1499 && selectedShipping?.price === 0 && (
                  <div className="bg-green-50 border border-green-300 rounded-lg p-3 -mx-2">
                    <p className="text-green-800 text-sm font-medium">
                      🎉 Congrats! You qualified for FREE shipping (orders ≥ R1,499)
                    </p>
                  </div>
                )}

                {cartTotal < 1499 && cartTotal > 0 && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 -mx-2">
                    <p className="text-yellow-800 text-sm">
                      💡 Add <strong>R{(1499 - cartTotal).toFixed(2)}</strong> more to qualify for FREE shipping!
                    </p>
                  </div>
                )}
                
                <hr className="my-4 border-gray-300" />
                
                <div className="flex justify-between py-3 text-2xl font-bold bg-gradient-to-r from-purple-50 to-blue-50 -mx-6 px-6 rounded-lg">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-blue-600">R{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Secure Payment with PayFast</h3>
                  <p className="text-sm text-gray-700">
                    You'll be redirected to PayFast to complete your payment securely. 
                    We accept all major credit cards, debit cards, and instant EFT.
                  </p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading || !selectedShipping || calculating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                  Processing...
                </span>
              ) : (
                `Proceed to Payment (R${grandTotal.toFixed(2)})`
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              By placing your order, you agree to our Terms & Conditions and Privacy Policy
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
