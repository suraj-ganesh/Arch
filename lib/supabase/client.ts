import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (typeof window === 'undefined') {
    throw new Error(
      "createClient() was called on the server. Use the server Supabase client in server components (lib/supabase/server.ts) or instantiate the browser client inside a useEffect on the client."
    );
  }

  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!url || !key) {
      // Avoid throwing in production runtime; log a helpful warning instead.
      // In Vercel builds the env vars must be set in project settings.
      console.warn('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    client = createBrowserClient(url, key);
  }

  return client;
}
