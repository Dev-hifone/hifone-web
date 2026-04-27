import { useState, useEffect } from 'react';
import { deviceApi } from '../lib/api';

// UI config — images, category, routeKey per brand
const BRAND_UI = {
  // Phones
  Apple:    { image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&q=80', category: 'phones',  routeKey: 'apple',    accentColor: '#E31E24' },
  Samsung:  { image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80', category: 'phones',  routeKey: 'samsung',  accentColor: '#1428A0' },
  Google:   { image: 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=400&q=80', category: 'phones',  routeKey: 'google',   accentColor: '#34A853' },
  Huawei:   { image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80', category: 'phones',  routeKey: 'huawei',   accentColor: '#CF0A2C' },
  Oppo:     { image: 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=400&q=80', category: 'phones',  routeKey: 'oppo',     accentColor: '#1D4ED8' },
  Motorola: { image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', category: 'phones',  routeKey: 'motorola', accentColor: '#E31E24' },
  Xiaomi:   { image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80', category: 'phones',  routeKey: 'xiaomi',   accentColor: '#FF6900' },
  OnePlus:  { image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', category: 'phones',  routeKey: 'oneplus',  accentColor: '#F5010C' },
  Vivo:     { image: 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=400&q=80', category: 'phones',  routeKey: 'vivo',     accentColor: '#415FFF' },
  Nokia:    { image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', category: 'phones',  routeKey: 'nokia',    accentColor: '#124191' },
  Nothing:  { image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&q=80', category: 'phones',  routeKey: 'nothing',  accentColor: '#111111' },
  Sony:     { image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', category: 'phones',  routeKey: 'sony',     accentColor: '#000000' },
  // Tablets
  iPad:     { image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', category: 'tablets', routeKey: 'ipad',     accentColor: '#8B5CF6' },
  // Laptops
  MacBook:  { image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80', category: 'laptops', routeKey: 'macbook',  accentColor: '#6B7280' },
  Dell:     { image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', category: 'laptops', routeKey: 'dell',     accentColor: '#007DB8' },
  HP:       { image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80', category: 'laptops', routeKey: 'hp',       accentColor: '#0096D6' },
  Lenovo:   { image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', category: 'laptops', routeKey: 'lenovo',   accentColor: '#E2231A' },
  Asus:     { image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80', category: 'laptops', routeKey: 'asus',     accentColor: '#00AEEF' },
  // Watches
  'Apple Watch': { image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80', category: 'watches', routeKey: 'applewatch',    accentColor: '#E31E24' },
  'Samsung Watch': { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', category: 'watches', routeKey: 'samsungwatch',  accentColor: '#1428A0' },
  Fitbit:   { image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80', category: 'watches', routeKey: 'fitbit',   accentColor: '#00B0B9' },
  Garmin:   { image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80', category: 'watches', routeKey: 'garmin',   accentColor: '#007AC2' },
};

const DEFAULT_UI = {
  image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&q=80',
  category: 'phones',
  routeKey: null,
  accentColor: '#E31E24',
};

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export function useBrandsData() {
  const [brands, setBrands] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache && Date.now() - cacheTime < CACHE_TTL) {
      setBrands(cache);
      setLoading(false);
      return;
    }
    deviceApi.getBrandsGrouped()
      .then(res => {
        const enriched = (res.data.brands || []).map(b => ({
          ...b,
          ...(BRAND_UI[b.brand] || DEFAULT_UI),
        }));
        cache = enriched;
        cacheTime = Date.now();
        setBrands(enriched);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { brands, loading };
}