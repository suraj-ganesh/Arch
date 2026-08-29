'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '../../../lib/mockData';
import { useCartStore } from '../../../lib/store/useCartStore';
import { useToast } from '../../../components/ToastProvider';
import { ShoppingBag, ArrowLeft, Check, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
  
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0] || 40);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addItem(product, selectedSize, quantity);
    showToast(`Added ${quantity}x ${product.name} (Size ${selectedSize}) to your bag!`, 'success');
  };

  const isLowStock = product.stock > 0 && product.stock <= 3;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8a817c] hover:text-[#463f3a] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-white border border-[#bcb8b1]/40 rounded-3xl overflow-hidden shadow-sm">
            {product.image_urls?.[activeImageIndex] ? (
              <img
                src={product.image_urls[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8a817c] text-xs">
                No Image Available
              </div>
            )}

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white/90 backdrop-blur-md text-[#463f3a] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#bcb8b1]/50">
                {product.brand}
              </span>
              {isLowStock && (
                <span className="bg-[#463f3a] text-white font-medium text-xs uppercase px-3 py-1 rounded-full">
                  Only {product.stock} left
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.image_urls.length > 1 && (
            <div className="flex gap-3">
              {product.image_urls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#839788] scale-105'
                      : 'border-[#bcb8b1]/40 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Controls */}
        <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div>
            <span className="text-xs font-bold text-[#839788] uppercase tracking-widest block mb-1">
              {product.brand} • {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#463f3a] tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs text-[#8a817c] leading-relaxed mt-3">
              {product.description}
            </p>
          </div>

          <div className="pt-4 border-t border-[#bcb8b1]/30 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-[#463f3a]">
              Rs. {product.price.toLocaleString()}
            </span>
            <span className="text-xs text-[#8a817c]">Inclusive of all local taxes</span>
          </div>

          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#463f3a] uppercase tracking-wider">Select Size (EU)</span>
              <span className="text-[#8a817c]">Standard Fit</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                    selectedSize === sz
                      ? 'bg-[#839788] border-[#839788] text-white shadow-sm'
                      : 'bg-[#f4f3ee] border-[#bcb8b1]/40 text-[#463f3a] hover:border-[#8a817c]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#463f3a] uppercase tracking-wider block">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-[#f4f3ee] border border-[#bcb8b1]/40 text-[#463f3a] font-bold hover:bg-[#bcb8b1]/20 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-[#463f3a] text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-9 h-9 rounded-xl bg-[#f4f3ee] border border-[#bcb8b1]/40 text-[#463f3a] font-bold hover:bg-[#bcb8b1]/20 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-[#bcb8b1]/40 text-[#8a817c] cursor-not-allowed'
                : 'bg-[#839788] hover:bg-[#463f3a] text-white shadow-md hover:scale-[1.01]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO SHOPPING BAG'}
          </button>

          {/* Guarantee Badges */}
          <div className="pt-4 border-t border-[#bcb8b1]/30 space-y-2 text-xs text-[#8a817c]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#839788]" />
              <span>Authentic Nike, Adidas, New Balance inventory</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#839788]" />
              <span>eSewa ePay v2 Secure Payment Integration</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
