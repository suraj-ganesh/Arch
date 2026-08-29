'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '../lib/types';
import { useCartStore } from '../lib/store/useCartStore';
import { useToast } from './ToastProvider';
import { ShoppingBag, CreditCard, Lock } from 'lucide-react';
import { createClient } from '../lib/supabase/client';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToast();
  const [canPurchase, setCanPurchase] = useState(false);
  const [purchaseChecked, setPurchaseChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function checkCardSession() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.user) {
        const role = session.user.user_metadata?.role;
        // Only regular (non-admin) logged-in users can purchase
        setCanPurchase(role !== 'admin');
      } else {
        // Guest — cannot purchase
        setCanPurchase(false);
      }
      setPurchaseChecked(true);
    }
    checkCardSession();
  }, []);

  const defaultSize = product.sizes[0] || 40;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canPurchase) {
      showToast('Please log in as a customer to add items to bag', 'error');
      return;
    }
    addItem(product, defaultSize, 1);
    showToast(`Added ${product.name} (Size ${defaultSize}) to bag`, 'success');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canPurchase) {
      showToast('Please log in as a customer to purchase', 'error');
      return;
    }
    addItem(product, defaultSize, 1);
    router.push('/checkout');
  };

  const isLowStock = product.stock > 0 && product.stock <= 3;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white border border-[#bcb8b1]/40 rounded-3xl overflow-hidden hover:border-[#8a817c] transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-[#463f3a]/5">
      
      {/* Image Container with preserved shoe photo */}
      <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] bg-[#f4f3ee] overflow-hidden">
        {product.image_urls?.[0] ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8a817c] text-xs">
            No Image
          </div>
        )}

        <span className="absolute top-3 left-3 bg-[#f4f3ee]/90 backdrop-blur-md text-[#463f3a] text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#bcb8b1]/50">
          {product.brand}
        </span>

        {isLowStock && (
          <span className="absolute top-3 right-3 bg-[#463f3a] text-[#f4f3ee] font-light text-[10px] uppercase px-2.5 py-0.5 rounded-full">
            Low Stock ({product.stock})
          </span>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4 font-sans">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#8a817c] font-light">
            <span className="uppercase tracking-wider">{product.category}</span>
            <span>{product.sizes.length} sizes</span>
          </div>

          <Link href={`/products/${product.id}`} className="group-hover:text-[#839788] transition-colors">
            <h3 className="text-sm font-normal text-[#463f3a] line-clamp-1 tracking-tight">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#8a817c] font-light line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Icons (Buy Now & Add To Bag) */}
        <div className="flex items-center justify-between pt-3 border-t border-[#bcb8b1]/30 gap-2">
          <div>
            <span className="text-[10px] text-[#8a817c] block uppercase tracking-wider font-light">Price</span>
            <span className="text-sm font-medium text-[#463f3a]">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Add To Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || !canPurchase}
              className={`p-2 rounded-full font-light text-xs transition-all flex items-center justify-center ${
                isOutOfStock || !canPurchase
                  ? 'bg-[#bcb8b1]/30 text-[#bcb8b1] cursor-not-allowed'
                  : 'bg-[#f4f3ee] border border-[#bcb8b1]/50 text-[#463f3a] hover:bg-[#839788] hover:text-white hover:border-[#839788]'
              }`}
              title={!canPurchase ? 'Login as a customer to add to bag' : 'Add to Shopping Bag'}
            >
              {!canPurchase && purchaseChecked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Direct Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock || !canPurchase}
              className={`px-3 py-1.5 rounded-full font-medium text-xs transition-all flex items-center gap-1 ${
                isOutOfStock || !canPurchase
                  ? 'bg-[#bcb8b1]/30 text-[#bcb8b1] cursor-not-allowed'
                  : 'bg-[#839788] hover:bg-[#463f3a] text-white shadow-xs'
              }`}
              title={!canPurchase ? 'Login as a customer to buy' : 'Buy Now'}
            >
              {!canPurchase && purchaseChecked ? (
                <Lock className="w-3 h-3" />
              ) : (
                <CreditCard className="w-3 h-3" />
              )}
              <span>{!canPurchase && purchaseChecked ? 'Login' : 'Buy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
