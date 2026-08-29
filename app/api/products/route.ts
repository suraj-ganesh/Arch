import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');

  try {
    const supabase = await createClient();
    let query = supabase.from('products').select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category.toLowerCase());
    }

    if (brand && brand !== 'all') {
      query = query.ilike('brand', brand);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (sort === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price-high') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: dbProducts, error } = await query;

    if (!error && dbProducts && dbProducts.length > 0) {
      return NextResponse.json(dbProducts);
    }
  } catch (e) {
    console.warn('Falling back to local data:', e);
  }

  // Graceful fallback to mock data if database is empty or configuring
  let filtered = [...MOCK_PRODUCTS];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (brand && brand !== 'all') {
    filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  }

  return NextResponse.json(filtered);
}
