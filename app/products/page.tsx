'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '../../components/ProductGrid';
import { Product } from '../../lib/types';
import { SlidersHorizontal, Search, RefreshCw } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setCategory(searchParams.get('category') || 'all');
    setBrand(searchParams.get('brand') || 'all');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'all') queryParams.set('category', category);
        if (brand !== 'all') queryParams.set('brand', brand);
        if (search) queryParams.set('search', search);
        if (sort) queryParams.set('sort', sort);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, brand, search, sort]);

  const clearFilters = () => {
    setCategory('all');
    setBrand('all');
    setSort('newest');
    setSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-xs font-bold text-[#839788] uppercase tracking-wider">Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#463f3a] tracking-tight mt-1">
            ALL FOOTWEAR
          </h1>
          <p className="text-xs text-[#8a817c] mt-1">
            Showing shoes from Nike, Adidas, New Balance, Puma, and Converse.
          </p>
        </div>

        {/* Search input in header */}
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search shoes or models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-full py-2 pl-9 pr-4 text-xs text-[#463f3a] placeholder-[#8a817c] focus:outline-none focus:border-[#839788] focus:bg-white transition-all"
          />
          <Search className="w-3.5 h-3.5 text-[#8a817c] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Main Filter & Products Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#bcb8b1]/30 pb-4">
              <h3 className="text-xs font-bold text-[#463f3a] uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#839788]" /> Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-[11px] text-[#8a817c] hover:text-[#463f3a] flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Brand Filter */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-[#8a817c] uppercase tracking-wider block">
                Brand
              </label>
              <div className="space-y-1">
                {['all', 'Nike', 'Adidas', 'New Balance', 'Puma', 'Converse'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      brand === b
                        ? 'bg-[#839788] text-white font-bold'
                        : 'text-[#463f3a] hover:bg-[#f4f3ee]'
                    }`}
                  >
                    {b === 'all' ? 'All Brands' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-[#8a817c] uppercase tracking-wider block">
                Category
              </label>
              <div className="space-y-1">
                {['all', 'men', 'women', 'kids'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                      category === cat
                        ? 'bg-[#463f3a] text-white font-bold'
                        : 'text-[#463f3a] hover:bg-[#f4f3ee]'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#8a817c] uppercase tracking-wider block">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 text-xs text-[#463f3a] font-medium rounded-xl p-2.5 focus:outline-none focus:border-[#839788]"
              >
                <option value="newest">Newest Releases</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#8a817c]">
            <span>Showing {products.length} product(s)</span>
          </div>

          <ProductGrid products={products} isLoading={loading} />
        </div>

      </div>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-[#8a817c] text-xs">
        Loading catalog...
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
