'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/client';
import { Package, Clock, CheckCircle2, Truck } from 'lucide-react';

export default function AccountOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });

          // Only show real orders from the database — no fake fallback data
          setOrders(data ?? []);
        } else {
          setOrders([]);
        }
      } catch (e) {
        console.warn('Orders fetch notice:', e);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#839788]/20 text-[#839788] text-xs font-medium uppercase">Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium uppercase">Shipped</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium uppercase">Pending</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-[#f4f3ee] text-[#8a817c] text-xs font-medium uppercase">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      <div className="flex items-center justify-between border-b border-[#bcb8b1]/40 pb-4">
        <div>
          <h1 className="text-3xl font-normal text-[#463f3a] tracking-tight">MY ORDERS</h1>
          <p className="text-xs text-[#8a817c] font-light mt-1">Track your purchases and delivery status</p>
        </div>
        <Link
          href="/account"
          className="text-xs font-medium text-[#839788] hover:underline"
        >
          View Profile Info
        </Link>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-xs text-[#8a817c]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-12 text-center space-y-3">
            <h3 className="text-base font-normal text-[#463f3a]">No Orders Placed Yet</h3>
            <p className="text-xs text-[#8a817c] font-light">Explore our catalog to place your first order.</p>
            <Link
              href="/products"
              className="inline-block px-5 py-2 rounded-full bg-[#839788] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#463f3a] transition-all"
            >
              Shop Catalog
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 space-y-6 shadow-xs">
              
              {/* Header info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#bcb8b1]/30 pb-4 text-xs font-light">
                <div>
                  <span className="text-[#8a817c] block">Order Ref</span>
                  <span className="font-mono font-medium text-[#463f3a] text-sm">{order.id}</span>
                </div>

                <div>
                  <span className="text-[#8a817c] block">Order Date</span>
                  <span className="font-medium text-[#463f3a]">{order.created_at?.split('T')[0] || order.created_at}</span>
                </div>

                <div>
                  <span className="text-[#8a817c] block">eSewa Ref Code</span>
                  <span className="font-mono text-[#839788] font-medium">{order.esewa_ref_id || '00049281A'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Timeline UI Component */}
              <div className="py-2">
                <span className="text-[11px] font-medium text-[#8a817c] uppercase tracking-wider block mb-3">
                  Order Delivery Timeline
                </span>
                <div className="grid grid-cols-4 gap-2 relative">
                  
                  <div className="text-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#839788] text-white flex items-center justify-center font-bold text-[10px] mx-auto">✓</div>
                    <span className="text-[11px] font-medium text-[#839788] block">Placed</span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#839788] text-white flex items-center justify-center font-bold text-[10px] mx-auto">✓</div>
                    <span className="text-[11px] font-medium text-[#839788] block">Paid (eSewa)</span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mx-auto ${
                      order.status === 'shipped' || order.status === 'delivered'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#f4f3ee] text-[#8a817c]'
                    }`}>
                      {order.status === 'shipped' || order.status === 'delivered' ? '✓' : '3'}
                    </div>
                    <span className={`text-[11px] font-medium block ${
                      order.status === 'shipped' || order.status === 'delivered' ? 'text-blue-600' : 'text-[#8a817c]'
                    }`}>Shipped</span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mx-auto ${
                      order.status === 'delivered'
                        ? 'bg-[#839788] text-white'
                        : 'bg-[#f4f3ee] text-[#8a817c]'
                    }`}>
                      {order.status === 'delivered' ? '✓' : '4'}
                    </div>
                    <span className={`text-[11px] font-medium block ${
                      order.status === 'delivered' ? 'text-[#839788]' : 'text-[#8a817c]'
                    }`}>Delivered</span>
                  </div>

                </div>
              </div>

              {/* Items summary */}
              <div className="pt-2 border-t border-[#bcb8b1]/30 space-y-2 text-xs font-light">
                {(order.order_items ?? order.items ?? []).map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-[#463f3a]">
                    <span>{item.products?.name || item.product?.name || 'Shoe Item'} (Size {item.size}) × {item.quantity}</span>
                    <span className="font-medium">Rs. {(item.price || 0).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm font-medium text-[#463f3a] pt-2 border-t border-[#bcb8b1]/30">
                  <span>Grand Total Paid</span>
                  <span>Rs. {(order.total_amount || 0).toLocaleString()}</span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
