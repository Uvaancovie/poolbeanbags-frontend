"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-base-100/80 backdrop-blur sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="text-xl font-bold tracking-tight">
            <Link href="/">Pool Beanbags</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/announcements" className="link">Announcements</Link>
            <Link href="/about" className="link">About</Link>
            <Link href="/faq" className="link">FAQ</Link>
            <Link href="/contact" className="link">Contact</Link>
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden btn btn-sm btn-ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-base-100/95 backdrop-blur">
            <nav className="flex flex-col gap-2 p-4">
              <Link href="/announcements" className="link link-hover py-2" onClick={() => setIsMenuOpen(false)}>Announcements</Link>
              <Link href="/about" className="link link-hover py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link href="/faq" className="link link-hover py-2" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
              <Link href="/contact" className="link link-hover py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link href="/shop" className="btn btn-sm btn-ghost justify-start" onClick={() => setIsMenuOpen(false)}>Shop</Link>
              <Link href="/cart" className="btn btn-sm btn-ghost justify-start relative" onClick={() => setIsMenuOpen(false)}>
                Cart
                {itemCount > 0 && (
                  <span className="badge badge-sm badge-primary absolute -top-1 -right-1">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link href="/admin/login" className="btn btn-sm btn-outline justify-start" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
