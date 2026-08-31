'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_PRODUCTS } from '../../lib/mockData';
import { Product } from '../../lib/types';
import { Plus, Edit, Trash2, Search, LogOut, Shield, UserCheck, Mail, ShieldAlert } from 'lucide-react';
import { useToast } from '../../components/ToastProvider';
import { createClient } from '../../lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [supabase, setSupabase] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Create the browser-only supabase client inside useEffect so it never runs during prerender.
    const client = createClient();
    setSupabase(client);

    async function checkAdminSession() {
      if (!client) return;
      const { data } = await client.auth.getSession();
      if (data.session?.user) {
        setAdminUser(data.session.user);
      }
    }
    checkAdminSession();

    async function loadAdminData() {
      if (!client) return;
      try {
        const { data } = await client.from('products').select('*');
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.warn('Admin DB query:', e);
      }
    }
    loadAdminData();
  }, []);

  const handleLogout = async () => {
    showToast('Signing out...', 'info');

    try {
      // Call the server-side logout route which clears the auth cookie properly
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      // The server redirects to /login — follow it with a full page navigation
      window.location.replace(res.url || '/login');
    } catch (e) {
      // Fallback: client-side signOut + manual redirect
      try {
        const client = supabase ?? createClient();
        await client.auth.signOut({ scope: 'global' });
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      } catch {}
      window.location.replace('/login?signedout=1');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {}
      showToast(`Removed "${name}" from inventory`, 'info');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = products.filter((p) => p.stock <= 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Dedicated Admin Profile Section */}
      <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#bcb8b1]/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#463f3a] text-[#f4f3ee] flex items-center justify-center font-light text-xl">
              AD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-normal text-[#463f3a]">
                  {adminUser?.user_metadata?.full_name || 'System Administrator'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-medium uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Root Admin
                </span>
              </div>
              <p className="text-xs text-[#8a817c] font-light mt-0.5">
                Authorized store inventory manager ({adminUser?.email || 'admin@arch.com'})
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-white border border-rose-300 text-rose-600 font-medium text-xs uppercase tracking-wider hover:bg-rose-50 transition-all flex items-center gap-1.5 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out Admin
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-light">
          <div className="p-4 bg-[#f4f3ee] border border-[#bcb8b1]/40 rounded-2xl space-y-1">
            <span className="text-[#8a817c] font-normal">Admin Account Email</span>
            <p className="text-[#463f3a] font-medium">{adminUser?.email || 'admin@arch.com'}</p>
          </div>

          <div className="p-4 bg-[#f4f3ee] border border-[#bcb8b1]/40 rounded-2xl space-y-1">
            <span className="text-[#8a817c] font-normal">Access Privileges</span>
            <p className="text-[#839788] font-medium">Full Catalog &amp; Order Control</p>
          </div>

          <div className="p-4 bg-[#f4f3ee] border border-[#bcb8b1]/40 rounded-2xl space-y-1">
            <span className="text-[#8a817c] font-normal">Active System Status</span>
            <p className="text-[#463f3a] font-medium">Supabase Cloud Connected</p>
          </div>
        </div>
      </div>

      {/* Admin Control Banner */}
      <div className="bg-[#463f3a] text-[#f4f3ee] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-widest text-[#839788] bg-white/10 px-3 py-1 rounded-full inline-block">
            Inventory Portal
          </span>
          <h1 className="text-3xl font-normal tracking-tight text-white">CATALOG &amp; STOCK CONTROL</h1>
          <p className="text-xs text-[#bcb8b1] font-light">Add new shoe models, upload product images, adjust prices, and manage orders.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-5 py-3 rounded-full bg-[#839788] hover:bg-white hover:text-[#463f3a] text-white font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add New Shoe
          </Link>
          <Link
            href="/admin/orders"
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider transition-all"
          >
            View Customer Orders
          </Link>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 shadow-xs">
          <span className="text-xs text-[#8a817c] font-light block">Total Shoe Models</span>
          <span className="text-3xl font-normal text-[#463f3a] mt-1 block">{products.length}</span>
        </div>
        <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 shadow-xs">
          <span className="text-xs text-[#8a817c] font-light block">Low Stock Models (≤3)</span>
          <span className="text-3xl font-normal text-rose-600 mt-1 block">{lowStock.length}</span>
        </div>
        <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 shadow-xs">
          <span className="text-xs text-[#8a817c] font-light block">Catalog Categories</span>
          <span className="text-3xl font-normal text-[#839788] mt-1 block">3 (Men, Women, Kids)</span>
        </div>
      </div>

      {/* Inventory Management Table */}
      <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 space-y-4 shadow-xs">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-base font-normal text-[#463f3a]">Inventory Table</h3>
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder="Search model or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-full py-2 pl-9 pr-4 text-xs text-[#463f3a] focus:outline-none focus:border-[#839788]"
            />
            <Search className="w-3.5 h-3.5 text-[#8a817c] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#bcb8b1]/30 text-[#8a817c] uppercase tracking-wider font-medium">
              <tr>
                <th className="py-3 px-4">Shoe Model</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Sizes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcb8b1]/30 text-[#463f3a] font-light">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#f4f3ee] transition-colors">
                  <td className="py-3 px-4 font-normal flex items-center gap-3">
                    <img src={p.image_urls[0]} alt="" className="w-9 h-9 rounded-xl object-cover bg-[#f4f3ee]" />
                    <span>{p.name}</span>
                  </td>
                  <td className="py-3 px-4">{p.brand}</td>
                  <td className="py-3 px-4 uppercase text-[#8a817c]">{p.category}</td>
                  <td className="py-3 px-4 font-medium">Rs. {p.price.toLocaleString()}</td>
                  <td className="py-3 px-4 font-medium">
                    <span className={p.stock <= 3 ? 'text-rose-600 font-bold' : 'text-[#463f3a]'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">{p.sizes.join(', ')}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors inline-block"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
