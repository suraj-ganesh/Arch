'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShieldCheck, CheckCircle2, Truck, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { createClient } from '@/lib/supabase/client';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const supabase = createClient();

  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data);
        }
      } catch (e) {
        console.warn('Admin orders fetch notice:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchAllOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    } catch (e) {}
    showToast(`Updated status of ${orderId} to ${newStatus}`, 'success');
  };

  const filteredOrders = orders.filter(
    (o) => filterStatus === 'all' || o.status === filterStatus
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      <div className="flex items-center justify-between border-b border-[#bcb8b1]/40 pb-6">
        <div>
          <span className="text-xs font-bold text-[#839788] uppercase tracking-widest">Order Management</span>
          <h1 className="text-3xl font-normal text-[#463f3a] tracking-tight">ALL CUSTOMER ORDERS</h1>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase transition-all ${
                filterStatus === st
                  ? 'bg-[#839788] text-white font-bold'
                  : 'bg-white border border-[#bcb8b1]/60 text-[#463f3a] hover:border-[#463f3a]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#bcb8b1]/40 rounded-3xl p-6 shadow-xs">
        {loading ? (
          <div className="text-center py-12 text-xs text-[#8a817c]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm text-[#463f3a]">No Customer Orders Found</p>
            <p className="text-xs text-[#8a817c]">Completed purchases will appear here for admin review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#bcb8b1]/30 text-[#8a817c] uppercase tracking-wider font-medium">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcb8b1]/30 text-[#463f3a] font-light">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#f4f3ee] transition-colors">
                    <td className="py-4 px-4 font-mono font-medium text-[#463f3a]">{o.id}</td>
                    <td className="py-4 px-4 font-normal">{o.customer_name || 'Customer'}</td>
                    <td className="py-4 px-4">{o.customer_phone || 'Not provided'}</td>
                    <td className="py-4 px-4 font-medium">Rs. {o.total_amount?.toLocaleString() || 0}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#839788]/20 text-[#839788] text-[11px] font-medium uppercase">
                        {o.payment_status || 'paid'} (eSewa)
                      </span>
                    </td>
                    <td className="py-4 px-4 uppercase font-medium">
                      {o.status}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="bg-[#f4f3ee] border border-[#bcb8b1]/50 rounded-full text-xs font-normal text-[#463f3a] px-3 py-1 focus:outline-none focus:border-[#839788]"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
