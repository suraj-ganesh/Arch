'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { useToast } from '../../components/ToastProvider';
import { Package, Mail, Phone, MapPin, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const [user, setUser] = useState<any>(null);
  // Start in loading state — wait for onAuthStateChange to fire before rendering
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // onAuthStateChange fires immediately with the current session (INITIAL_SESSION event),
    // so we don't need getSession() separately; this avoids the race condition.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    showToast('Logged out successfully', 'info');
    router.push('/');
  };

  // Wait until onAuthStateChange has fired at least once
  if (!ready) {
    return (
      <div className="text-center py-20 text-xs text-[#8a817c] font-light">
        Checking account session...
      </div>
    );
  }

  // ── GUEST STATE ──────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 font-sans">
        <div className="w-16 h-16 bg-white border border-[#bcb8b1]/40 rounded-full flex items-center justify-center mx-auto text-[#8a817c]">
          <Mail className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-normal text-[#463f3a]">NO ACTIVE SESSION</h2>
          <p className="text-xs text-[#8a817c] font-light">
            You are browsing as a guest. Sign in or create an account to view your profile and orders.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/login"
            className="w-full py-3 rounded-full bg-[#839788] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#463f3a] transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> SIGN IN
          </Link>
          <Link
            href="/signup"
            className="w-full py-3 rounded-full bg-white border border-[#bcb8b1]/60 text-[#463f3a] font-medium text-xs uppercase tracking-wider hover:border-[#463f3a] transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> CREATE ACCOUNT
          </Link>
        </div>
      </div>
    );
  }

  // ── LOGGED-IN STATE ──────────────────────────────────────────────
  const initials = user.email?.substring(0, 2).toUpperCase() ?? 'US';
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer';
  const role = user.user_metadata?.role || 'customer';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#bcb8b1]/40 pb-4">
        <div>
          <h1 className="text-3xl font-normal text-[#463f3a] tracking-tight">MY ACCOUNT</h1>
          <p className="text-xs text-[#8a817c] font-light mt-1">Manage profile details &amp; order history</p>
        </div>

        <div className="flex items-center gap-3">
          {role !== 'admin' && (
            <Link
              href="/account/orders"
              className="px-4 py-2 rounded-full bg-[#839788] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#463f3a] transition-all flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" /> My Orders
            </Link>
          )}

          {role === 'admin' && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-full bg-[#463f3a] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#839788] transition-all"
            >
              Admin Dashboard
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-white border border-rose-300 text-rose-600 font-medium text-xs uppercase tracking-wider hover:bg-rose-50 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">

        <div className="flex items-center gap-4 border-b border-[#bcb8b1]/30 pb-6">
          <div className="w-16 h-16 rounded-full bg-[#463f3a] text-[#f4f3ee] flex items-center justify-center font-light text-xl select-none">
            {initials}
          </div>
          <div>
            <h3 className="text-xl font-normal text-[#463f3a]">{displayName}</h3>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#839788]/15 text-[#839788] text-[10px] font-medium uppercase">
              {role} Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
          <div className="p-4 bg-[#f4f3ee] border border-[#bcb8b1]/40 rounded-2xl space-y-1">
            <span className="text-[#8a817c] flex items-center gap-1.5 font-normal">
              <Mail className="w-3.5 h-3.5 text-[#839788]" /> Email Address
            </span>
            <p className="text-[#463f3a] font-medium">{user.email}</p>
          </div>

          <div className="p-4 bg-[#f4f3ee] border border-[#bcb8b1]/40 rounded-2xl space-y-1">
            <span className="text-[#8a817c] flex items-center gap-1.5 font-normal">
              <Phone className="w-3.5 h-3.5 text-[#839788]" /> Phone Number
            </span>
            <p className="text-[#463f3a] font-medium">{user.phone || 'Not provided'}</p>
          </div>

          <div className="p-4 bg-[#f4f3ee] border border-[#bcb8b1]/40 rounded-2xl space-y-1 sm:col-span-2">
            <span className="text-[#8a817c] flex items-center gap-1.5 font-normal">
              <MapPin className="w-3.5 h-3.5 text-[#839788]" /> Default Delivery Address
            </span>
            <p className="text-[#463f3a] font-medium">{user.user_metadata?.address || 'Not provided'}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
