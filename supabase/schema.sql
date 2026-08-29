-- Supabase Schema for Arch Shoe E-Commerce Platform

-- 1. Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default now()
);

-- 2. Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  brand text,
  category text check (category in ('men', 'women', 'kids')),
  price numeric not null check (price >= 0),
  sizes int[] default '{38,39,40,41,42,43,44}',
  stock int not null default 0 check (stock >= 0),
  image_urls text[],
  created_at timestamp with time zone default now()
);

-- 3. Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text,
  customer_phone text,
  shipping_address text,
  total_amount numeric not null check (total_amount >= 0),
  status text default 'pending' check (status in ('pending', 'shipped', 'delivered', 'cancelled')),
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid', 'failed')),
  esewa_ref_id text,
  created_at timestamp with time zone default now()
);

-- 4. Order Items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  size int,
  quantity int check (quantity > 0),
  price numeric check (price >= 0)
);

-- Row Level Security (RLS) Rules

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles Policies
create policy "Public profiles read" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Products Policies
create policy "Anyone can read products" on public.products for select using (true);
create policy "Admins can insert products" on public.products for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update products" on public.products for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete products" on public.products for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Orders Policies
create policy "Users read own orders" on public.orders for select using (
  auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can insert orders" on public.orders for insert with check (
  auth.uid() = user_id or user_id is null
);
create policy "Admins can update orders" on public.orders for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Order Items Policies
create policy "Users read own order items" on public.order_items for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and (orders.user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  )
);
create policy "Anyone insert order items" on public.order_items for insert with check (true);
