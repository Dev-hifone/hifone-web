import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useBrandsData } from '../../hooks/useBrandsData';

// Static categories — but brand tags come from MongoDB via hook
const CATEGORY_CONFIG = [
  {
    key: 'phones',
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&q=80',
    title: 'iPhones / Android Phones',
    items: ['Screen Replacement', 'Battery Replacement', 'Charging Port', 'Camera Repair', 'Water Damage', 'Software Issues'],
    defaultHref: '/devices?category=phones',
    accentColor: '#E31E24',
  },
  {
    key: 'tablets',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    title: 'iPad / Other Brand Tablets',
    items: ['Screen Replacement', 'Battery Replacement', 'Charging Port', 'Speaker Repair', 'Software Issues'],
    defaultHref: '/devices?category=tablets',
    accentColor: '#8B5CF6',
  },
  {
    key: 'laptops',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80',
    title: 'MacBook / Windows Laptops / Chromebooks',
    items: ['Screen Replacement', 'Battery Replacement', 'Keyboard Repair', 'Charging Port', 'Virus Removal', 'Data Recovery'],
    defaultHref: '/devices?category=laptops',
    accentColor: '#FF6B00',
  },
  {
    key: 'watches',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
    title: 'Smart Watch Repair',
    items: ['Screen Replacement', 'Battery Replacement', 'Crown / Button Fix', 'Water Damage', 'Band Replacement'],
    defaultHref: '/devices?category=watches',
    accentColor: '#10B981',
  },
];

const BRANDS = ['Apple', 'Samsung', 'Google', 'Huawei', 'Oppo', 'Dell', 'HP', 'Lenovo', 'Asus', 'Xiaomi', 'OnePlus', 'Nokia'];

const BrandItem = ({ name, hidden = false }) => (
  <div className="flex items-center justify-center shrink-0 px-4" aria-hidden={hidden || undefined}>
    <span className="font-display font-semibold text-lg text-[#999999] hover:text-[#111111] transition-colors duration-300 whitespace-nowrap">
      {name}
    </span>
  </div>
);

const BrandsMarquee = () => {
  return (
    <div className="py-12 bg-[#F8F8F8] overflow-hidden border-y border-gray-100">
      <div className="text-center mb-6">
        <p className="text-overline mb-1">We Repair All Brands</p>
        <h3 className="font-display font-bold text-[#111111] text-xl">Trusted by customers across Adelaide</h3>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F8F8F8] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F8F8F8] to-transparent z-10" />
        <div className="flex animate-marquee gap-6 items-center">
          {BRANDS.map((name) => <BrandItem key={name} name={name} />)}
          {/* Duplicate set for the seamless loop only; hidden from AT & crawlers. */}
          {BRANDS.map((name) => <BrandItem key={`dup-${name}`} name={name} hidden />)}
        </div>
      </div>
    </div>
  );
};

export const ServicesGrid = () => {
  const { brands } = useBrandsData();

  // Entries that are categories/placeholders in the DB, not real phone brands.
  const NON_BRANDS = new Set(['Drone', 'Other', 'Others', 'Generic']);

  // Map brands to categories
  const getBrandsForCategory = (categoryKey) => {
    return brands
      .filter(b => b.category === categoryKey && !NON_BRANDS.has(b.brand))
      .slice(0, 5);
  };

  return (
    <>
      <section className="py-20 lg:py-28 bg-white" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <p className="text-overline mb-3">What We Fix</p>
            <h2 className="text-h2 mb-4">Device Repair Services</h2>
            <p className="text-body-large max-w-xl mx-auto">From cracked screens to dead batteries — we fix all devices same day.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {CATEGORY_CONFIG.map((cat, i) => {
              const catBrands = getBrandsForCategory(cat.key);
              return (
                <motion.div key={cat.key}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-[#F8F8F8] border-2 border-transparent hover:border-[#E31E24] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">

                  <Link to={cat.defaultHref} className="block relative h-44 overflow-hidden">
                    <img src={cat.image} alt={cat.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <h3 className="absolute bottom-4 left-5 right-5 font-display font-bold text-white text-lg leading-tight">
                      {cat.title}
                    </h3>
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cat.accentColor }} />
                  </Link>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-1.5 mb-5">
                      {cat.items.map(item => (
                        <div key={item} className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cat.accentColor }} />
                          <span className="text-[#555555] text-xs">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dynamic brand tags from MongoDB */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {catBrands.length > 0 ? catBrands.map(b => (
                        <Link key={b.brand}
                          to={b.routeKey ? `/devices/${b.routeKey}?from=${cat.key}` : `/devices?category=${cat.key}`}
                          onClick={e => e.stopPropagation()}
                          className="text-xs px-2.5 py-1 rounded-full bg-white text-[#555555] border border-gray-200 hover:border-[#E31E24] hover:text-[#E31E24] transition-all font-medium">
                          {b.brand}
                        </Link>
                      )) : (
                        // Fallback skeleton while loading
                        [1,2,3].map(n => <div key={n} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />)
                      )}
                    </div>

                    <Link to={cat.defaultHref}
                      className="inline-flex items-center gap-1 text-xs font-bold"
                      style={{ color: cat.accentColor }}>
                      Book Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <BrandsMarquee />
    </>
  );
};

export default ServicesGrid;
