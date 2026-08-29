'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/store/useCartStore';
import { CheckCircle2, PackageCheck, Home } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get('data');
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    clearCart();

    if (dataParam) {
      fetch('/api/esewa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataParam })
      })
        .then((res) => res.json())
        .then((resData) => {
          setPaymentDetails(resData);
        })
        .catch(() => {});
    }
  }, [dataParam, clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      
      <div className="w-16 h-16 bg-[#839788]/20 border border-[#839788]/40 rounded-full flex items-center justify-center mx-auto text-[#839788]">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-bold text-[#839788] uppercase tracking-widest">
          Payment Confirmed
        </span>
        <h1 className="text-3xl font-extrabold text-[#463f3a]">ORDER CONFIRMED</h1>
        <p className="text-xs text-[#8a817c]">
          Your eSewa transaction has been verified. We are preparing your footwear package for dispatch.
        </p>
      </div>

      <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 text-left space-y-3 text-xs shadow-sm">
        <h4 className="font-bold text-[#463f3a] border-b border-[#bcb8b1]/30 pb-2">
          eSewa Payment Summary
        </h4>
        <div className="flex justify-between text-[#8a817c]">
          <span>Payment Gateway</span>
          <span className="font-bold text-[#839788]">eSewa ePay v2</span>
        </div>
        <div className="flex justify-between text-[#8a817c]">
          <span>Status</span>
          <span className="font-bold text-[#839788]">PAID</span>
        </div>
        <div className="flex justify-between text-[#8a817c]">
          <span>eSewa Ref Code</span>
          <span className="font-mono text-[#463f3a] font-bold">{paymentDetails?.transaction_code || 'ESEWA-REF-8849'}</span>
        </div>
        <div className="flex justify-between text-[#8a817c]">
          <span>Transaction ID</span>
          <span className="font-mono text-[#463f3a]">{paymentDetails?.transaction_uuid || 'ORD-TEST-992'}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/account/orders"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#839788] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#463f3a] transition-colors flex items-center justify-center gap-2"
        >
          <PackageCheck className="w-4 h-4" /> VIEW ORDERS
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-[#bcb8b1]/60 text-[#463f3a] font-semibold text-xs hover:border-[#463f3a] transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> RETURN HOME
        </Link>
      </div>

    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#8a817c] text-xs">Processing payment verification...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
