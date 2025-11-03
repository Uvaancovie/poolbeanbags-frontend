"use client";
import { useState } from "react";

export default function OzowPayButton({ payload }: { payload: any }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    try {
      setBusy(true);
      setError(null);
      
      const r = await fetch("/api/checkout/ozow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await r.json();
      
      if (!r.ok) {
        throw new Error(data.error || "create failed");
      }
      
      if (!data.ozow) {
        throw new Error("No Ozow data returned");
      }

      const { ozow } = data;
      
      // Create and submit form to Ozow
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://pay.ozow.com/";
      
      Object.entries(ozow).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v ?? "");
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
    } catch (e: any) {
      console.error("Ozow payment error:", e);
      setError(e.message || "Could not start Ozow checkout.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={go}
        disabled={busy}
        className="w-full h-12 rounded-lg border border-black bg-white text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        aria-label="Pay with Ozow"
      >
        {busy ? "Processing…" : "Pay with Ozow"}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
