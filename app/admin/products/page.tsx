'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { createClient } from '@/lib/supabase/client';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await supabase.from('products').select('*');
        if (data) {
          setProducts(data);
        }
      } catch (e) {
        console.warn('Admin products fetch:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {}
      showToast(`Deleted ${name}`, 'info');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#bcb8b1]/40 pb-6">
        <div>
          <span className="text-xs font-bold text-[#839788] uppercase tracking-widest">Inventory</span>
          <h1 className="text-3xl font-normal text-[#463f3a] tracking-tight">MANAGE PRODUCTS</h1>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-3 rounded-full bg-[#839788] hover:bg-[#463f3a] text-white font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add New Shoe
        </Link>
      </div>

      <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 space-y-4 shadow-xs">
        
        {/* Search filter */}
        <div className="max-w-md relative">
          <input
            type="text"
            placeholder="Search by product name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-full py-2 pl-9 pr-4 text-xs text-[#463f3a] focus:outline-none focus:border-[#839788]"
          />
          <Search className="w-3.5 h-3.5 text-[#8a817c] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Products table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-[#8a817c]">Loading catalog...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#bcb8b1]/30 text-[#8a817c] uppercase tracking-wider font-medium">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Available Sizes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcb8b1]/30 text-[#463f3a] font-light">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f4f3ee] transition-colors">
                    <td className="py-3 px-4 font-normal text-[#463f3a] flex items-center gap-3">
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
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
}
