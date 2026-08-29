import React from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw, ShoppingBag } from 'lucide-react';

export default function CheckoutFailurePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      
      <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-rose-500">
        <XCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
          Payment Incomplete
        </span>
        <h1 className="text-3xl font-black text-white">PAYMENT WAS CANCELLED OR FAILED</h1>
        <p className="text-sm text-slate-300">
          Your eSewa transaction could not be completed. Don't worry, no funds were deducted from your account.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/checkout"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> RETRY PAYMENT
        </Link>
        <Link
          href="/cart"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> BACK TO CART
        </Link>
      </div>

    </div>
  );
}
