'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../lib/store/useCartStore';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-white border border-[#bcb8b1]/40 rounded-full flex items-center justify-center mx-auto text-[#8a817c]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#463f3a]">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-[#8a817c] max-w-xs mx-auto">
          Explore our Nike, Adidas, and New Balance collections to add shoes to your bag.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#839788] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#463f3a] transition-all"
        >
          EXPLORE STORE <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 150;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex items-center justify-between border-b border-[#bcb8b1]/40 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#463f3a] tracking-tight">SHOPPING BAG</h1>
          <p className="text-xs text-[#8a817c] mt-0.5">Review items before proceeding to eSewa checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}`}
              className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.product.image_urls[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-2xl bg-[#f4f3ee] border border-[#bcb8b1]/30 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#839788] uppercase tracking-wider">{item.product.brand}</span>
                  <h3 className="text-sm font-bold text-[#463f3a] line-clamp-1">{item.product.name}</h3>
                  <div className="text-xs text-[#8a817c] mt-1">
                    <span>Size: <strong className="text-[#463f3a]">{item.size}</strong></span>
                  </div>
                  <span className="text-sm font-bold text-[#463f3a] mt-2 block sm:hidden">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#bcb8b1]/30">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-[#f4f3ee] border border-[#bcb8b1]/40 text-[#463f3a] font-bold hover:bg-[#bcb8b1]/20"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-[#463f3a]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-[#f4f3ee] border border-[#bcb8b1]/40 text-[#463f3a] font-bold hover:bg-[#bcb8b1]/20"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-extrabold text-[#463f3a] hidden sm:block min-w-[100px] text-right">
                  Rs. {(item.product.price * item.quantity).toLocaleString()}
                </span>

                <button
                  onClick={() => removeItem(item.product.id, item.size)}
                  className="p-1.5 text-[#8a817c] hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-[#463f3a] border-b border-[#bcb8b1]/30 pb-3">
            BAG SUMMARY
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#8a817c]">
              <span>Subtotal</span>
              <span className="text-[#463f3a] font-bold">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#8a817c]">
              <span>Shipping (Nepal)</span>
              <span className="text-[#463f3a] font-bold">Rs. {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#8a817c]">
              <span>Payment Option</span>
              <span className="text-[#839788] font-bold">eSewa ePay v2</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#bcb8b1]/30 flex justify-between items-baseline">
            <span className="text-sm font-bold text-[#463f3a]">Total Payable</span>
            <span className="text-2xl font-extrabold text-[#463f3a]">
              Rs. {grandTotal.toLocaleString()}
            </span>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 rounded-full bg-[#839788] hover:bg-[#463f3a] text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
