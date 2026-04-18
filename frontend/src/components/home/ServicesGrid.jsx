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

const BRANDS = [
  { name: 'Apple',   logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg' },
  { name: 'Google',  logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Huawei',  logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Huawei_Standard_logo.svg' },
  { name: 'Oppo',    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/OPPO_LOGO_2019.svg' },
  { name: 'Dell',    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg' },
  { name: 'HP',      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' },
  { name: 'Lenovo',  logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg' },
  { name: 'Asus',    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg' },
  { name: 'Xiaomi',  logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' },
  { name: 'OnePlus', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/OnePlus_logo.svg' },
  { name: 'Nokia',   logo: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Nokia_wordmark.svg' },
];

const BrandsMarquee = () => {
  const doubled = [...BRANDS, ...BRANDS];
  return (
    <div className="py-12 bg-[#F8F8F8] overflow-hidden border-y border-gray-100">
      <div className="text-center mb-6">
        <p className="text-overline mb-1">We Repair All Brands</p>
        <h3 className="font-display font-bold text-[#111111] text-xl">Trusted by customers across Adelaide</h3>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F8F8F8] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F8F8F8] to-transparent z-10" />
        <div className="flex animate-marquee gap-10 items-center">
          {doubled.map((brand, i) => (
            <div key={`${brand.name}-${i}`} className="flex flex-col items-center gap-2 shrink-0 group">
              <div className="w-20 h-12 flex items-center justify-center">
                <img src={brand.logo} alt={brand.name}
                  className="max-h-10 max-w-[80px] w-auto object-contain grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all duration-300"
                  onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <span className="text-xs text-[#999999] font-medium">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ServicesGrid = () => {
  const { brands } = useBrandsData();

  // Map brands to categories
  const getBrandsForCategory = (categoryKey) => {
    return brands.filter(b => b.category === categoryKey).slice(0, 5);
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
