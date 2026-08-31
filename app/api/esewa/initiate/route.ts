import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prepareEsewaPayload } from '@/lib/esewa';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // MANDATORY AUTH CHECK: Users can only order when logged in
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to place an order.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, customerName, customerPhone, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );
    const deliveryFee = 150;
    const grandTotal = totalAmount + deliveryFee;

    const orderId = `ORD-${Date.now()}-${Date.now()}`;

    // ── Save order to database BEFORE redirecting to eSewa ──────────────────
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.user.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        total_amount: grandTotal,
        status: 'pending',
        payment_status: 'unpaid',
        esewa_ref_id: orderId,  // Store our order ref to match on verify
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Failed to save order:', orderError);
      return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 });
    }

    const dbOrderId = orderData.id;

    // ── Save order items ─────────────────────────────────────────────────────
    const orderItems = items.map((item: any) => ({
      order_id: dbOrderId,
      product_id: item.product.id,
      size: item.size,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Failed to save order items:', itemsError);
      // Don't block payment — order exists, items can be reconciled
    }
    // ────────────────────────────────────────────────────────────────────────

    // Prefer an explicit public base URL from env (set this in Vercel Env Vars).
    // Fallback to the request host when not provided (useful for local dev).
    const explicitBase = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
    let baseUrl = '';
    if (explicitBase) {
      // VERCEL_URL may not include protocol, ensure it does.
      baseUrl = explicitBase.startsWith('http') ? explicitBase : `https://${explicitBase}`;
    } else {
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      baseUrl = `${protocol}://${host}`;
    }

    const esewaPayload = prepareEsewaPayload({
      amount: grandTotal,
      orderId,
      baseUrl
    });

    // Log the callback URLs for debugging (visible in Vercel build logs)
    console.log('eSewa success_url:', esewaPayload.success_url);
    console.log('eSewa failure_url:', esewaPayload.failure_url);

    return NextResponse.json({
      success: true,
      orderId,
      dbOrderId,
      totalAmount: grandTotal,
      esewaPayload
    });
  } catch (err: any) {
    console.error('Error initiating order:', err);
    return NextResponse.json({ error: err.message || 'Payment initiation failed' }, { status: 500 });
  }
}
