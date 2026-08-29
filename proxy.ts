import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
