'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import { MOCK_PRODUCTS } from '../lib/mockData';
import { ArrowRight, Star, CheckCircle2, Footprints, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [currentShoeIndex, setCurrentShoeIndex] = useState(0);

  const heroShoes = MOCK_PRODUCTS;

  // Auto-slide hero section every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentShoeIndex((prev) => (prev + 1) % heroShoes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroShoes.length]);

  const nextShoe = () => {
    setCurrentShoeIndex((prev) => (prev + 1) % heroShoes.length);
  };

  const prevShoe = () => {
    setCurrentShoeIndex((prev) => (prev - 1 + heroShoes.length) % heroShoes.length);
  };

  const activeHeroShoe = heroShoes[currentShoeIndex];

  const filteredTrending = selectedBrand === 'All'
    ? MOCK_PRODUCTS.slice(0, 4)
    : MOCK_PRODUCTS.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());

  return (
    <div className="space-y-16 pb-20 pt-4 font-sans">
      
      {/* ELEVIQ Hero Layout Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[520px]">
          
          {/* Left Column: Headline with lighter font weight & Dark Pill CTA */}
          <div className="lg:col-span-6 space-y-6 text-left pr-0 lg:pr-4">
            
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-[#463f3a] tracking-tight leading-[1.08]">
                PROFESSIONAL <br />
                <span className="text-[#8a817c] font-light italic">FOOTWEAR</span> FOR EVERY <br />
                <span className="text-[#463f3a] font-normal">DAILY MOTION</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-[#8a817c] max-w-md leading-relaxed font-light">
              From your first daily stride to professional athletic performance. Find <strong className="text-[#463f3a] font-medium">the right sneaker</strong> and step with unyielding confidence.
            </p>

            {/* ELEVIQ Style Pill CTA Button */}
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-[#463f3a] text-white rounded-full p-2 pl-6 pr-2 shadow-sm hover:bg-[#839788] transition-all group hover:scale-102"
              >
                <span className="text-xs font-medium uppercase tracking-wider">Find Your Shoe</span>
                <div className="w-9 h-9 rounded-full bg-white text-[#463f3a] flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <Footprints className="w-4 h-4 text-[#463f3a]" />
                </div>
              </Link>
            </div>

          </div>

          {/* Right Column: Interactive Carousel Frame */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Background Arch Frame with Carousel Transition */}
            <div className="relative w-full aspect-[4/3] rounded-t-full rounded-b-3xl overflow-hidden bg-gradient-to-tr from-[#463f3a] via-[#8a817c] to-[#839788] border border-[#bcb8b1]/40 shadow-xl group">
              <img
                key={activeHeroShoe.id}
                src={activeHeroShoe.image_urls[0]}
                alt={activeHeroShoe.name}
                className="w-full h-full object-cover opacity-90 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#463f3a]/80 via-transparent to-transparent" />
              
              {/* Product Badge & Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-[#839788] bg-white px-2.5 py-0.5 rounded-full">
                    {activeHeroShoe.brand} • Featured
                  </span>
                  <h3 className="text-base sm:text-lg font-normal text-white mt-1 line-clamp-1">{activeHeroShoe.name}</h3>
                </div>
                <Link
                  href={`/products/${activeHeroShoe.id}`}
                  className="text-xs font-normal text-white bg-[#839788] hover:bg-[#463f3a] px-3.5 py-1.5 rounded-full transition-colors"
                >
                  Rs. {activeHeroShoe.price.toLocaleString()}
                </Link>
              </div>

              {/* User Manual Controls */}
              <button
                onClick={prevShoe}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md text-[#463f3a] flex items-center justify-center hover:bg-white transition-all shadow-sm"
                title="Previous Shoe"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextShoe}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md text-[#463f3a] flex items-center justify-center hover:bg-white transition-all shadow-sm"
                title="Next Shoe"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute top-4 right-4 flex gap-1.5 bg-black/20 backdrop-blur-md px-2 py-1 rounded-full">
                {heroShoes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentShoeIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      currentShoeIndex === idx ? 'bg-white w-4' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ELEVIQ Style 3 Bottom Stat & Rating Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-5 flex items-center justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
              </div>
              <p className="text-xs font-normal text-[#463f3a]">
                Trusted by <span className="text-[#839788] font-medium">5,000+ Athletes</span>
              </p>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-amber-500 font-medium text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
              <span className="text-[10px] text-[#8a817c]">Average Rating</span>
            </div>
          </div>

          <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-5 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-2xl font-light text-[#463f3a]">50+</span>
              <p className="text-xs font-normal text-[#8a817c] mt-0.5">Curated Shoe Models</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#839788]/20 text-[#839788] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#839788] text-white rounded-3xl p-5 flex items-center justify-between shadow-xs">
            <div>
              <span className="text-2xl font-light text-white">24hr</span>
              <p className="text-xs font-normal text-white/90 mt-0.5">Express Nepal Dispatch</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* Trending Shoes Showcase Grid with Brand Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#bcb8b1]/40 pb-4">
          <div>
            <span className="text-xs font-medium text-[#839788] uppercase tracking-wider">Top Selections</span>
            <h2 className="text-2xl font-normal text-[#463f3a] tracking-tight">TRENDING SHOES</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'Nike', 'Adidas', 'New Balance', 'Puma'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedBrand === b
                    ? 'bg-[#463f3a] text-white shadow-xs'
                    : 'bg-white border border-[#bcb8b1]/50 text-[#8a817c] hover:text-[#463f3a]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid products={filteredTrending} />
      </section>

    </div>
  );
}
