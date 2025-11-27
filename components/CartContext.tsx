"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SHIPPING_FLAT_CENTS } from "@/lib/pricing";

interface CartItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
  fabric?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number, fabric?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getSubtotalCents: () => number;
  getDiscountCents: () => number;
  getTotalCents: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, quantity = 1, fabric?: string) => {
    const existingItem = items.find(item => 
      item.productId === product.id && item.fabric === fabric
    );

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${fabric || 'default'}-${Date.now()}`,
        productId: product.id,
        title: product.title,
        slug: product.slug,
        price: product.is_promotional && product.promotion_discount_percent
          ? Math.round(product.base_price_cents * (1 - product.promotion_discount_percent / 100))
          : product.base_price_cents,
        quantity,
        image: product.images?.[0]?.url,
        fabric
      };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(items.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0) / 100;
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const getSubtotalCents = () =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const getDiscountCents = () => {
    const count = getItemCount();
    const subtotal = getSubtotalCents();
    
    // Valid until Dec 1st
    // const now = new Date();
    // if (now > new Date('2025-12-01T23:59:59')) return 0;

    let percent = 0;
    if (count >= 3) percent = 20;
    else if (count === 2) percent = 10;
    else if (count >= 1) percent = 5;
    
    return Math.round(subtotal * (percent / 100));
  };

  const getTotalCents = () => {
    const subtotal = getSubtotalCents();
    const discount = getDiscountCents();
    const shipping = items.length > 0 ? SHIPPING_FLAT_CENTS : 0;
    // Note: Shipping logic might need to match cart/checkout page (lounger check)
    // But for now, let's stick to what was here or improve it.
    // The previous code was: getSubtotalCents() + (items.length > 0 ? SHIPPING_FLAT_CENTS : 0);
    // It didn't seem to handle the lounger shipping logic inside CartContext, 
    // but checkout page does. 
    // Let's keep shipping simple here or just return subtotal + shipping - discount.
    // Actually, CartContext's getTotalCents seems to use SHIPPING_FLAT_CENTS constant.
    // Checkout page has more complex logic. 
    // Let's just subtract discount from the result.
    return subtotal + (items.length > 0 ? SHIPPING_FLAT_CENTS : 0) - discount;
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      getSubtotalCents,
      getDiscountCents,
      getTotalCents
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}