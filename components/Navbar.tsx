"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";
import Image from "next/image";

export default function Navbar() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-40 border-b-4" style={{ borderColor: 'var(--gold)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="text-2xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
            <Link href="/">
              <Image src="/logo.jpg" alt="Pool Beanbags Logo" width={120} height={60} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/announcements" className="text-gray-700 hover:text-[var(--ink)] font-medium transition-colors">📢 Announcements</Link>
            <Link href="/about" className="text-gray-700 hover:text-[var(--ink)] font-medium transition-colors">ℹ️ About</Link>
            <Link href="/faq" className="text-gray-700 hover:text-[var(--ink)] font-medium transition-colors">❓ FAQ</Link>
            <Link href="/contact" className="text-gray-700 hover:text-[var(--ink)] font-medium transition-colors">✉️ Contact</Link>
            <Link href="/shop" className="px-4 py-2" style={{ backgroundColor: 'var(--ink)', color: 'white' }}>
              🛍️ Shop
            </Link>
            <Link href="/cart" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-all relative">
              🛒 Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link href="/admin/login" className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white font-semibold transition-all">Admin</Link>
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
