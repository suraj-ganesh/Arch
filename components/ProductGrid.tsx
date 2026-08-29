import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../lib/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-4 h-[350px] animate-pulse flex flex-col justify-between">
            <div className="w-full h-44 bg-[#f4f3ee] rounded-2xl mb-4" />
            <div className="space-y-2">
              <div className="h-3 bg-[#bcb8b1]/30 rounded w-1/4" />
              <div className="h-5 bg-[#bcb8b1]/30 rounded w-3/4" />
              <div className="h-3 bg-[#bcb8b1]/30 rounded w-full" />
            </div>
            <div className="h-9 bg-[#bcb8b1]/30 rounded-full mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-12 text-center my-8">
        <h3 className="text-base font-bold text-[#463f3a] mb-1">No Footwear Found</h3>
        <p className="text-xs text-[#8a817c] max-w-xs mx-auto">
          We couldn't find any products matching your selected search or brand filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
