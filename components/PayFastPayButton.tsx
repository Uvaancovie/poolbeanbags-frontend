"use client";

import { useState } from "react";
import { API_BASE } from "../lib/api";

interface PayFastPayButtonProps {
  items: any[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  shippingInfo: any;
  customer: {
    first_name: string;
    last_name: string;
    email_address: string;
  };
  onError?: (error: string) => void;
}

export default function PayFastPayButton({
  items,
  subtotal,
  shipping,
  discount = 0,
  total,
  shippingInfo,
  customer,
  onError,
}: PayFastPayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Call backend to create PayFast payment
      const response = await fetch(`${API_BASE}/api/payfast/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal,
          shipping,
          discount,
          total,
          shippingInfo,
          customer,
        }),
      });

      const data = await response.json();

      if (!data.success || !data.post) {
        throw new Error(data.error || "Failed to create payment");
      }

      console.log("[PAYFAST] Payment created:", data.post);

      // Create and submit form to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = process.env.NEXT_PUBLIC_PAYFAST_PAYMENT_URL || 
        "https://www.payfast.co.za/eng/process";

      Object.entries(data.post).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error("[PAYFAST ERROR]", error);
      setLoading(false);
      if (onError) {
        onError(error.message || "Payment failed. Please try again.");
      }
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
    >
      {loading ? "Processing..." : "Pay with PayFast"}
    </button>
  );
}
