'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/ToastProvider';
import { createClient } from '../../lib/supabase/client';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    // Step 1: Create the auth user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'customer',
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Step 2: Check if email confirmation is required
    // Supabase returns a session=null + identities=[] when the email already exists
    // It returns session=null + identities.length>0 when confirmation is needed
    const identitiesCount = signUpData.user?.identities?.length ?? 0;
    const hasSession = !!signUpData.session;

    if (identitiesCount === 0) {
      // Email already registered
      setError('An account with this email already exists. Please sign in.');
      setLoading(false);
      return;
    }

    if (!hasSession) {
      // Email confirmation is enabled in Supabase — user needs to verify email
      // Try to auto-sign-in anyway (works if confirmation is disabled)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData.session) {
        // Confirmation is truly required — show info state
        setNeedsConfirmation(true);
        setLoading(false);
        return;
      }

      // Auto-sign-in succeeded (confirmation was disabled)
      // Insert profile row manually in case trigger hasn't fired
      await supabase.from('profiles').upsert({
        id: signInData.user.id,
        full_name: fullName,
        role: 'customer',
      });

      showToast(`Welcome, ${fullName}! Account created.`, 'success');
      router.push('/account');
      return;
    }

    // hasSession = true — user was created AND auto-signed in (no confirmation needed)
    await supabase.from('profiles').upsert({
      id: signUpData.user!.id,
      full_name: fullName,
      role: 'customer',
    });

    showToast(`Welcome, ${fullName}! Account created.`, 'success');
    router.push('/account');
    setLoading(false);
  };

  // Email confirmation required state
  if (needsConfirmation) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 font-sans">
        <div className="w-16 h-16 bg-[#839788]/15 text-[#839788] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-normal text-[#463f3a]">CHECK YOUR EMAIL</h2>
          <p className="text-xs text-[#8a817c] font-light leading-relaxed">
            A confirmation link has been sent to <span className="font-medium text-[#463f3a]">{email}</span>.
            Click the link in the email to verify your account, then come back to sign in.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block w-full py-3 rounded-full bg-[#839788] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#463f3a] transition-all"
        >
          Go to Sign In
        </Link>
        <p className="text-[11px] text-[#8a817c] font-light">
          Note: If you don&apos;t see it, check your spam folder.
          You can also ask the admin to disable email confirmation for demo use.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 font-sans">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-normal text-[#463f3a]">CREATE ACCOUNT</h1>
        <p className="text-xs text-[#8a817c] font-light">Join Arch to place orders and track delivery</p>
      </div>

      <form onSubmit={handleSignup} className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">

        {error && (
          <div className="flex items-start gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#8a817c] uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setError(''); }}
              className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-2xl py-3 pl-10 pr-4 text-xs text-[#463f3a] focus:outline-none focus:border-[#839788]"
              placeholder="e.g. Suman Pokhrel"
            />
            <User className="w-4 h-4 text-[#8a817c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

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
            Password <span className="font-light text-[#bcb8b1] normal-case">(min. 6 characters)</span>
          </label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={6}
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
          <UserPlus className="w-4 h-4" /> {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </button>

        <div className="text-center text-xs text-[#8a817c] font-light pt-2 border-t border-[#bcb8b1]/30">
          <span>Already registered? </span>
          <Link href="/login" className="text-[#839788] font-medium hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
