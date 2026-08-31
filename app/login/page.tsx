'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '../../components/ToastProvider';
import { createClient } from '../../lib/supabase/client';
import { LogIn, Lock, Mail, AlertCircle } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [supabase, setSupabase] = useState<any | null>(null);
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);
  const isSignedOut = searchParams.get('signedout') === '1';

  // Initialize the browser-only Supabase client and check session when ready
  useEffect(() => {
    let client = supabase;
    if (!client && typeof window !== 'undefined') {
      client = createClient();
      setSupabase(client);
    }

    if (isSignedOut) {
      setSessionChecked(true);
      return;
    }

    if (!client) return;

    (async function checkLoginSession() {
      try {
        const { data } = await client.auth.getSession();
        const session = data.session;
        if (session?.user) {
          const role = session.user.user_metadata?.role;
          if (role === 'admin') {
            router.push('/admin');
          } else {
            router.push(redirect);
          }
        } else {
          setSessionChecked(true);
        }
      } catch (err) {
        setSessionChecked(true);
      }
    })();
  }, [supabase, isSignedOut]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const client = supabase ?? (typeof window !== 'undefined' ? createClient() : null);
    if (!client) {
      setError('Unable to initialize authentication client');
      setLoading(false);
      return;
    }

    const { data, error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    showToast('Signed in successfully!', 'success');

    const role = data.user?.user_metadata?.role;
    if (role === 'admin' || email === 'admin@arch.com') {
      router.push('/admin');
      router.refresh();
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  // Don't render the form until we know there's no active session
  if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-6 h-6 rounded-full border-2 border-[#839788] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 font-sans">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-normal text-[#463f3a]">WELCOME BACK</h1>
        <p className="text-xs text-[#8a817c] font-light">Sign in to your Arch account</p>
      </div>

      <form onSubmit={handleLogin} className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">

        {error && (
          <div className="flex items-start gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#8a817c] uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-2xl py-3 pl-10 pr-4 text-xs text-[#463f3a] focus:outline-none focus:border-[#839788]"
              placeholder="you@example.com"
            />
            <Mail className="w-4 h-4 text-[#8a817c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#8a817c] uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-2xl py-3 pl-10 pr-4 text-xs text-[#463f3a] focus:outline-none focus:border-[#839788]"
              placeholder="••••••••"
            />
            <Lock className="w-4 h-4 text-[#8a817c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-[#839788] hover:bg-[#463f3a] text-white font-medium text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
        >
          <LogIn className="w-4 h-4" /> {loading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>

        <div className="text-center text-xs text-[#8a817c] font-light pt-2 border-t border-[#bcb8b1]/30">
          <span>Don&apos;t have an account? </span>
          <Link href="/signup" className="text-[#839788] font-medium hover:underline">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#8a817c] text-xs">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
