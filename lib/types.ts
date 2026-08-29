export interface Profile {
  id: string;
  full_name: string | null;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: 'men' | 'women' | 'kids';
  price: number;
  sizes: number[];
  stock: number;
  image_urls: string[];
  created_at: string;
}

export interface CartItem {
  product: Product;
  size: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id?: string | null;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'failed';
  esewa_ref_id?: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  size: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface EsewaInitiatePayload {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}
