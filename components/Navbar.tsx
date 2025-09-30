"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="w-full bg-base-100/80 backdrop-blur sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="text-xl font-bold tracking-tight">
            <Link href="/">Pool Beanbags</Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/announcements" className="link">Announcements</Link>
            <Link href="/shop" className="btn btn-sm btn-ghost">Shop</Link>
            <Link href="/cart" className="btn btn-sm btn-ghost relative">
              Cart
              {itemCount > 0 && (
                <span className="badge badge-sm badge-primary absolute -top-2 -right-2">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link href="/admin/login" className="btn btn-sm btn-outline">Admin</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
