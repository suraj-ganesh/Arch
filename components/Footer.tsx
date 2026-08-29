import React from 'react';
import Link from 'next/link';
import ArchLogo from './ArchLogo';

export default function Footer() {
  return (
    <footer className="bg-[#f4f3ee] border-t border-[#bcb8b1]/40 text-[#8a817c] py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ArchLogo className="h-6 w-auto" />
            </div>
            <p className="text-xs text-[#8a817c] leading-relaxed">
              Curated footwear from Nike, Adidas, New Balance, Puma, and Converse with integrated eSewa payments.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#463f3a] mb-3 uppercase tracking-wider">Popular Brands</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?brand=Nike" className="hover:text-[#463f3a] transition-colors">Nike Collection</Link></li>
              <li><Link href="/products?brand=Adidas" className="hover:text-[#463f3a] transition-colors">Adidas Originals</Link></li>
              <li><Link href="/products?brand=New%20Balance" className="hover:text-[#463f3a] transition-colors">New Balance</Link></li>
              <li><Link href="/products?brand=Puma" className="hover:text-[#463f3a] transition-colors">Puma Heritage</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#463f3a] mb-3 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/account/orders" className="hover:text-[#463f3a] transition-colors">Order Tracking</Link></li>
              <li><Link href="/cart" className="hover:text-[#463f3a] transition-colors">Shopping Bag</Link></li>
              <li><a href="#" className="hover:text-[#463f3a] transition-colors">Returns & Exchange</a></li>
              <li><a href="#" className="hover:text-[#463f3a] transition-colors">Size Guide</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#463f3a] mb-3 uppercase tracking-wider">Local Gateway</h4>
            <div className="p-4 bg-white border border-[#bcb8b1]/50 rounded-2xl space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#463f3a]">
                <span className="w-2 h-2 rounded-full bg-[#839788] inline-block animate-pulse"></span>
                <span>eSewa ePay v2 Enabled</span>
              </div>
              <p className="text-[11px] text-[#8a817c]">
                Nepal digital wallet standard with secure signature payload verification.
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-[#bcb8b1]/30 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8a817c] gap-4">
          <p>© {new Date().getFullYear()} ARCH Footwear. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="hover:text-[#463f3a]">Admin Portal</Link>
            <span>•</span>
            <a href="#" className="hover:text-[#463f3a]">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
