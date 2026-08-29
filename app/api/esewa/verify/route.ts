import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decodeEsewaResponse } from '@/lib/esewa';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json({ error: 'Missing response data payload' }, { status: 400 });
    }

    const decoded = decodeEsewaResponse(data);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid Base64 payload' }, { status: 400 });
    }

    // eSewa returns status 'COMPLETE' on successful payment
    const isSuccess = decoded.status === 'COMPLETE';

    if (isSuccess && decoded.transaction_uuid) {
      // ── Update the matching order in the database ───────────────────────
      // transaction_uuid is the orderId we generated (ORD-xxx) stored in esewa_ref_id
      const supabase = await createClient();

      // Step 1: Find the order by our transaction_uuid (stored as esewa_ref_id)
      const { data: matchedOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('esewa_ref_id', decoded.transaction_uuid)
        .single();

      if (matchedOrder) {
        // Step 2: Update by DB UUID — replace esewa_ref_id with the real eSewa transaction code
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'pending',
            esewa_ref_id: decoded.transaction_code || decoded.transaction_uuid,
          })
          .eq('id', matchedOrder.id);

        if (updateError) {
          console.error('Failed to update order payment status:', updateError);
        } else {
          console.log(`Order ${matchedOrder.id} marked as PAID (eSewa: ${decoded.transaction_code})`);
        }
      } else {
        console.warn(`No order found for transaction_uuid: ${decoded.transaction_uuid}`);
      }
      // ────────────────────────────────────────────────────────────────────
    }

    return NextResponse.json({
      success: isSuccess,
      status: decoded.status,
      transaction_code: decoded.transaction_code,
      total_amount: decoded.total_amount,
      transaction_uuid: decoded.transaction_uuid,
      product_code: decoded.product_code
    });
  } catch (err: any) {
    console.error('Error verifying eSewa payment:', err);
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 });
  }
}
