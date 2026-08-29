'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../lib/store/useCartStore';
import { useToast } from '../../components/ToastProvider';
import { createClient } from '../../lib/supabase/client';
import { ESEWA_CONFIG } from '../../lib/esewa';
import { ShieldCheck, Lock, LogIn } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { items, getTotalPrice } = useCartStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    shippingAddress: ''
  });

  useEffect(() => {
    setMounted(true);
    // Check active Supabase Auth session
    async function checkCheckoutSession() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      setUserSession(session);
      if (session?.user) {
        setFormData((prev) => ({
          ...prev,
          customerName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Customer'
        }));
      }
      setCheckingAuth(false);
    }
    checkCheckoutSession();
  }, []);

  if (!mounted || checkingAuth) return null;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 150;
  const grandTotal = subtotal + deliveryFee;

  // MANDATORY AUTH CHECK: Redirect to login if unauthenticated
  if (!userSession) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 font-sans">
        <div className="w-16 h-16 bg-[#839788]/20 text-[#839788] rounded-full flex items-center justify-center mx-auto">
          <LogIn className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-normal text-[#463f3a]">AUTHENTICATION REQUIRED</h2>
          <p className="text-xs text-[#8a817c] font-light">
            You must be logged in to your account to place an order and proceed with eSewa checkout.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/login?redirect=/checkout"
            className="w-full py-3 rounded-full bg-[#839788] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#463f3a] transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> SIGN IN TO CHECKOUT
          </Link>
          <Link
            href="/signup"
            className="w-full py-3 rounded-full bg-white border border-[#bcb8b1]/60 text-[#463f3a] font-medium text-xs uppercase tracking-wider hover:border-[#463f3a] transition-all"
          >
            CREATE NEW ACCOUNT
          </Link>
        </div>
      </div>
    );
  }

  const handleEsewaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/esewa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          amount: grandTotal,
          ...formData
        })
      });

      const data = await response.json();

      if (!data.success || !data.esewaPayload) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = ESEWA_CONFIG.initiateUrl;

      Object.entries(data.esewaPayload).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      console.error('Checkout error:', err);
      showToast(err.message || 'Payment initiation failed', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      <div>
        <h1 className="text-3xl font-normal text-[#463f3a] tracking-tight">CHECKOUT</h1>
        <p className="text-xs text-[#8a817c] font-light mt-0.5">Shipping details for logged in user ({userSession.user.email})</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shipping Form */}
        <form onSubmit={handleEsewaPayment} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="text-sm font-normal text-[#463f3a] border-b border-[#bcb8b1]/30 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#839788]" /> Shipping Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-[#8a817c] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-2xl px-4 py-3 text-xs text-[#463f3a] focus:outline-none focus:border-[#839788] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8a817c] uppercase tracking-wider mb-1.5">
                  Mobile Number (Nepal)
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-2xl px-4 py-3 text-xs text-[#463f3a] focus:outline-none focus:border-[#839788] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8a817c] uppercase tracking-wider mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-2xl px-4 py-3 text-xs text-[#463f3a] focus:outline-none focus:border-[#839788] focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#839788]/40 rounded-3xl p-6 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#839788]/15 text-[#839788] flex items-center justify-center font-normal text-sm">
                eS
              </div>
              <div>
                <h4 className="text-xs font-normal text-[#463f3a]">eSewa ePay v2 Gateway</h4>
                <p className="text-[11px] text-[#8a817c] font-light">Sandbox test mode with HMAC-SHA256 signature</p>
              </div>
            </div>
            <Lock className="w-4 h-4 text-[#839788]" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#839788] hover:bg-[#463f3a] text-white font-medium text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-[1.01]"
          >
            {loading ? 'Redirecting to eSewa...' : `PAY RS. ${grandTotal.toLocaleString()} VIA ESEWA`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 space-y-6 shadow-xs">
          <h3 className="text-xs font-medium text-[#463f3a] uppercase tracking-wider border-b border-[#bcb8b1]/30 pb-3">
            Bag Items ({items.length})
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex items-center justify-between text-xs font-light">
                <div className="flex items-center gap-3">
                  <img src={item.product.image_urls[0]} alt="" className="w-9 h-9 rounded-xl object-cover bg-[#f4f3ee]" />
                  <div>
                    <p className="font-normal text-[#463f3a] line-clamp-1">{item.product.name}</p>
                    <p className="text-[#8a817c]">Size {item.size} × {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium text-[#463f3a]">
                  Rs. {(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#bcb8b1]/30 space-y-2 text-xs text-[#8a817c] font-light">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#463f3a] font-medium">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-[#463f3a] font-medium">Rs. {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-medium text-sm text-[#463f3a] pt-2 border-t border-[#bcb8b1]/30">
              <span>Total Payable</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
