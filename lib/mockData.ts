import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  // ── BUDGET & ACCESSIBLE (Rs. 2,500 – Rs. 7,500) ─────────────────────────
  {
    id: 'prod-goldstar-trainer',
    name: 'Goldstar Classic Canvas Trainer',
    description: 'Everyday durable Nepalese canvas sneaker with high-density vulcanized rubber outsole and breathable fabric upper.',
    brand: 'Goldstar',
    category: 'men',
    price: 2450,
    sizes: [38, 39, 40, 41, 42, 43],
    stock: 45,
    image_urls: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-converse-kids-star',
    name: 'Converse Chuck Taylor All Star Junior',
    description: 'Iconic canvas low-top built for active kids featuring soft foam cushioning and flexible rubber traction.',
    brand: 'Converse',
    category: 'kids',
    price: 4800,
    sizes: [28, 29, 30, 31, 32, 33, 34],
    stock: 20,
    image_urls: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-bata-flex-walk',
    name: 'Bata Power Flex Walking Shoe',
    description: 'Ultra-lightweight mesh daily walker with shock-absorbing memory foam footbed and soft collar padding.',
    brand: 'Bata',
    category: 'women',
    price: 3850,
    sizes: [35, 36, 37, 38, 39],
    stock: 30,
    image_urls: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-vans-authentic-budget',
    name: 'Vans Authentic Core Black',
    description: 'Heritage skate shoe featuring sturdy canvas upper, metal eyelets, and original rubber waffle tread.',
    brand: 'Vans',
    category: 'men',
    price: 6900,
    sizes: [39, 40, 41, 42, 43],
    stock: 18,
    image_urls: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },

  // ── MID-RANGE & EVERYDAY FAVOURITES (Rs. 8,500 – Rs. 16,500) ─────────────
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
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000'
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
    id: 'prod-puma-velocity-nitro',
    name: 'Puma Velocity Nitro 3',
    description: 'All-in-one neutral running shoe powered by NITRO Foam response technology and PUMAGRIP durable outsole.',
    brand: 'Puma',
    category: 'women',
    price: 14200,
    sizes: [36, 37, 38, 39],
    stock: 14,
    image_urls: [
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&q=80&w=1000'
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
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },

  // ── PREMIUM & HIGH PERFORMANCE (Rs. 17,500 – Rs. 28,000) ───────────────
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
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-asics-gel-kayano',
    name: 'Asics GEL-Kayano 30 Stability',
    description: 'Advanced stability running shoe engineered with 4D GUIDANCE SYSTEM technology and PureGEL rearfoot cushioning.',
    brand: 'Asics',
    category: 'men',
    price: 21500,
    sizes: [40, 41, 42, 43, 44],
    stock: 11,
    image_urls: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=1000'
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
    stock: 2,
    image_urls: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=1000'
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

  // ── LUXURY & ULTRA-HIGH END (Rs. 32,000 – Rs. 68,000) ───────────────────
  {
    id: 'prod-on-cloud-surfer',
    name: 'On Running Cloudsurfer Next',
    description: 'Swiss-engineered ultra-cushioned trainer featuring CloudTec Phase computer-optimized midsole technology.',
    brand: 'On Running',
    category: 'women',
    price: 32000,
    sizes: [37, 38, 39, 40],
    stock: 6,
    image_urls: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-salomon-xt6',
    name: 'Salomon XT-6 Gore-Tex Black',
    description: 'Ultra-trail legend engineered with waterproof GORE-TEX membrane, Agile Chassis System, and Contagrip lugs.',
    brand: 'Salomon',
    category: 'men',
    price: 36500,
    sizes: [41, 42, 43, 44],
    stock: 5,
    image_urls: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-balenciaga-track',
    name: 'Balenciaga Track Trainer Mesh',
    description: 'High-fashion multi-paneled luxury trainer composed of 96 complex components with dynamic sculpted outsole.',
    brand: 'Balenciaga',
    category: 'men',
    price: 68000,
    sizes: [40, 41, 42, 43, 44],
    stock: 3,
    image_urls: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=1000'
    ],
    created_at: new Date().toISOString()
  }
];
