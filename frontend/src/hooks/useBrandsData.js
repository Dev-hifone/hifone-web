import { useState, useEffect } from 'react';
import { deviceApi } from '../lib/api';

// Brand display config — images + category mapping
// These are UI config only (images/colors), not data
const BRAND_UI = {
  Apple:   {
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&q=80',
    category: 'phones',
    routeKey: 'apple',
    accentColor: '#E31E24',
  },
  Samsung: {
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
    category: 'phones',
    routeKey: 'samsung',
    accentColor: '#1428A0',
  },
  iPad:    {
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    category: 'tablets',
    routeKey: 'ipad',
    accentColor: '#8B5CF6',
  },
  Google:  {
    image: 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=400&q=80',
    category: 'phones',
    routeKey: 'google',
    accentColor: '#34A853',
  },
};

const DEFAULT_UI = {
  image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&q=80',
  category: 'phones',
  routeKey: null,
  accentColor: '#E31E24',
};

// Cache so all components share one fetch
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

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
