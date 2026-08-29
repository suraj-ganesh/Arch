import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-nike-jordan1',
    name: 'Air Jordan 1 Retro High OG',
    description: 'Iconic basketball heritage sneaker constructed with premium full-grain leather, encapsulated Air cushioning, and classic Wings logo.',
    brand: 'Nike',
    category: 'men',
    price: 24500,
    sizes: [40, 41, 42, 43, 44, 45],
    stock: 12,
    image_urls: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-adidas-samba',
    name: 'Adidas Samba OG White',
    description: 'Timeless indoor soccer heritage silhouette featuring soft leather upper, suede overlays, and signature gum rubber sole.',
    brand: 'Adidas',
    category: 'women',
    price: 16800,
    sizes: [36, 37, 38, 39, 40, 41],
    stock: 18,
    image_urls: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-nb-9060',
    name: 'New Balance 9060 Sea Salt',
    description: 'Futuristic Y2K runner aesthetic featuring sculpted dual-density midsole with ABZORB and SBS cushioning technology.',
    brand: 'New Balance',
    category: 'men',
    price: 22900,
    sizes: [40, 41, 42, 43, 44],
    stock: 2, // Low stock demo
    image_urls: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-nike-af1',
    name: 'Nike Air Force 1 \'07 Triple White',
    description: 'The legendary low-top sneaker featuring crisp leather edges, clean finish, and classic metal dubrae accent.',
    brand: 'Nike',
    category: 'women',
    price: 15500,
    sizes: [36, 37, 38, 39, 40],
    stock: 25,
    image_urls: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-puma-palermo',
    name: 'Puma Palermo Special',
    description: 'Terrace culture classic with T-toe construction, vintage foil branding, and rich suede detailing.',
    brand: 'Puma',
    category: 'men',
    price: 13500,
    sizes: [39, 40, 41, 42, 43],
    stock: 9,
    image_urls: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-adidas-ultraboost',
    name: 'Adidas Ultraboost Light 1.0',
    description: 'High-performance running shoe with responsive Light BOOST midsole and breathable Primeknit upper.',
    brand: 'Adidas',
    category: 'men',
    price: 23000,
    sizes: [41, 42, 43, 44, 45],
    stock: 14,
    image_urls: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-converse-chuck70',
    name: 'Converse Chuck 70 Vintage Canvas',
    description: 'Upgraded heritage high-top with heavy-grade canvas, glossy egret rubber sidewall, and cushioned OrthoLite insole.',
    brand: 'Converse',
    category: 'kids',
    price: 9800,
    sizes: [32, 33, 34, 35, 36],
    stock: 15,
    image_urls: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-nb-550',
    name: 'New Balance 550 White Grey',
    description: 'Clean retro basketball sneaker returning from 1989 with low-top streamlined silhouette and heavy leather panels.',
    brand: 'New Balance',
    category: 'women',
    price: 17900,
    sizes: [37, 38, 39, 40],
    stock: 7,
    image_urls: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  }
];
