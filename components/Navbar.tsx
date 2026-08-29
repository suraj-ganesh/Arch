'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '../lib/store/useCartStore';
import ArchLogo from './ArchLogo';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const totalCartCount = useCartStore((state) => state.getTotalCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-[#f4f3ee]/90 backdrop-blur-xl border border-[#bcb8b1]/50 rounded-full px-4 sm:px-6 py-2.5 shadow-md flex items-center justify-between gap-4">
        
        {/* Official SVG Logo + ARCH text in Primary Font */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <ArchLogo className="h-6 sm:h-7 w-auto" />
          <span className="font-sans font-bold text-lg tracking-wider text-[#463f3a] group-hover:text-[#839788] transition-colors">
            ARCH
          </span>
        </Link>

        {/* Right Side Controls & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Search Bar positioned on the right */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center bg-[#bcb8b1]/25 border border-[#bcb8b1]/50 rounded-full pl-3.5 pr-1 py-1 text-xs w-48 lg:w-60">
            <input
              type="text"
              placeholder="Search shoes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[#463f3a] placeholder-[#8a817c] focus:outline-none font-sans"
            />
            <button
              type="submit"
              className="w-6 h-6 rounded-full bg-[#463f3a] text-white flex items-center justify-center hover:bg-[#839788] transition-colors shrink-0 ml-1"
            >
              <Search className="w-3 h-3" />
            </button>
          </form>

          <Link
            href="/products"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#bcb8b1]/60 text-xs font-semibold text-[#463f3a] hover:border-[#463f3a] shadow-xs transition-all font-sans"
          >
            <span>Catalog</span>
          </Link>

          <Link
            href="/account"
            className="p-2 rounded-full text-[#463f3a] hover:bg-[#bcb8b1]/30 transition-colors"
            title="Account"
          >
            <User className="w-4 h-4" />
          </Link>

          <Link
            href="/cart"
            className="relative p-2 rounded-full text-[#463f3a] hover:bg-[#bcb8b1]/30 transition-colors"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {mounted && totalCartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#839788] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
                {totalCartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-full text-[#463f3a] hover:bg-[#bcb8b1]/30"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-3xl p-4 shadow-xl space-y-3 font-sans">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-[#bcb8b1]/60 rounded-full px-3 py-1.5 text-xs">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[#463f3a] focus:outline-none"
            />
            <button type="submit" className="p-1 text-[#463f3a]">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-col space-y-1">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-[#463f3a] hover:bg-[#bcb8b1]/20"
            >
              All Shoes
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-[#463f3a] hover:bg-[#bcb8b1]/20"
            >
              My Account
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-[#839788] bg-white border border-[#bcb8b1]/40"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
