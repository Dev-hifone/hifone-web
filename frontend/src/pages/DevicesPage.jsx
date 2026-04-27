import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Smartphone, Tablet, Laptop, Watch, ChevronRight } from 'lucide-react';
import { deviceApi, serviceApi } from '../lib/api';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion';
import { useBrandsData } from '../hooks/useBrandsData';

const WHATSAPP = 'https://wa.me/61432977092';

const CATEGORY_CONFIG = {
  phones: {
    title: 'iPhones / Android Phones',
    subtitle: 'Screen, battery, charging port & more',
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&q=80',
    accentColor: '#E31E24',
    icon: Smartphone,
    items: ['Screen Replacement', 'Battery Replacement', 'Charging Port', 'Camera Repair', 'Water Damage', 'Software Issues'],
  },
  tablets: {
    title: 'iPad / Other Tablets',
    subtitle: 'All models — Pro, Air, Mini & more',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    accentColor: '#8B5CF6',
    icon: Tablet,
    items: ['Screen Replacement', 'Battery Replacement', 'Charging Port', 'Speaker Repair', 'Software Issues'],
  },
  laptops: {
    title: 'MacBook / Laptops / Chromebooks',
    subtitle: 'Screen, keyboard, battery & more',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80',
    accentColor: '#FF6B00',
    icon: Laptop,
    items: ['Screen Replacement', 'Battery Replacement', 'Keyboard Repair', 'Charging Port', 'Virus Removal', 'Data Recovery'],
  },
  watches: {
    title: 'Smart Watch Repair',
    subtitle: 'Screen, battery, band & more',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
    accentColor: '#10B981',
    icon: Watch,
    items: ['Screen Replacement', 'Battery Replacement', 'Crown / Button Fix', 'Water Damage', 'Band Replacement'],
  },
};

// Generic brand page for any brand
function BrandPage({ brand, fromCategory }) {
  const navigate = useNavigate();
  const { brands: allBrands } = useBrandsData();
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Map routeKey → actual brand name in DB
  const ROUTE_TO_BRAND = {
    apple: 'Apple', samsung: 'Samsung', ipad: 'iPad', google: 'Google',
    huawei: 'Huawei', oppo: 'Oppo', motorola: 'Motorola', xiaomi: 'Xiaomi',
    oneplus: 'OnePlus', vivo: 'Vivo', nokia: 'Nokia', nothing: 'Nothing',
    sony: 'Sony', macbook: 'MacBook', dell: 'Dell', hp: 'HP',
    lenovo: 'Lenovo', asus: 'Asus',
    applewatch: 'Apple Watch', samsungwatch: 'Samsung Watch',
    fitbit: 'Fitbit', garmin: 'Garmin',
  };

  const actualBrand = ROUTE_TO_BRAND[brand?.toLowerCase()] || brand;
  const brandUI = allBrands.find(b => b.brand === actualBrand);
  const backHref = fromCategory ? `/devices?category=${fromCategory}` : '/devices';
  const catConfig = fromCategory ? CATEGORY_CONFIG[fromCategory] : CATEGORY_CONFIG.phones;

  useEffect(() => {
    Promise.all([
      deviceApi.getByBrand(actualBrand),
      serviceApi.getAll(),
    ]).then(([devRes, svcRes]) => {
      setDevices(devRes.data || []);
      setServices(svcRes.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [brand]);

  return (
    <div data-testid={`devices-${brand}-page`}>
      <SEO title={`${actualBrand} Repair Adelaide | HiFone`}
        description={`${actualBrand} repair in Kurralta Park. Screen, battery, water damage and more. Same-day service.`} />

      <section className="relative py-14 bg-[#111111] overflow-hidden">
        {brandUI?.image && <img src={brandUI.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />}
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/40 mb-6 flex-wrap">
            <Link to="/devices" className="hover:text-white transition-colors">All Devices</Link>
            <ChevronRight className="w-3 h-3" />
            {fromCategory && <><Link to={`/devices?category=${fromCategory}`} className="hover:text-white transition-colors">{catConfig?.title}</Link><ChevronRight className="w-3 h-3" /></>}
            <span className="text-white">{actualBrand}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">{actualBrand} Repair Adelaide</h1>
          <p className="text-white/60">Select your model, then choose your repair — same day service available.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Step bar */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
            {[
              { n: 1, label: 'Device Type', done: true },
              { n: 2, label: 'Brand', done: true },
              { n: 3, label: 'Model', done: !!selectedDevice },
              { n: 4, label: 'Repair', done: false },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-center gap-2 shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.done ? 'bg-[#E31E24] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{s.n}</span>
                  {s.label}
                </div>
                {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />}
              </div>
            ))}
          </div>

          {!selectedDevice ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-5">
                <Link to={backHref} className="flex items-center gap-1.5 text-[#777] hover:text-[#111] text-sm font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Link>
                <h2 className="font-display font-bold text-[#111] text-xl">Select Your Model</h2>
              </div>
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => <div key={i} className="h-20 bg-[#F8F8F8] rounded-xl animate-pulse" />)}
                </div>
              ) : devices.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {devices.map(device => (
                    <button key={device.id} onClick={() => setSelectedDevice(device)}
                      className="group p-4 bg-[#F8F8F8] border-2 border-transparent hover:border-[#E31E24] rounded-xl text-center transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <Smartphone className="w-6 h-6 text-[#E31E24] mx-auto mb-2" />
                      <p className="font-semibold text-[#111] text-sm group-hover:text-[#E31E24] transition-colors">{device.name}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#F8F8F8] rounded-2xl">
                  <p className="text-5xl mb-4">📱</p>
                  <p className="font-bold text-[#111] text-lg mb-2">Models coming soon!</p>
                  <p className="text-[#555] text-sm mb-4">WhatsApp us with your model for an instant quote.</p>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-6 py-2.5 text-sm font-bold transition-colors">
                    WhatsApp for a Quote
                  </a>
                </div>
              )}
              <div className="mt-6 p-5 bg-[#F8F8F8] rounded-2xl text-center">
                <p className="text-[#555] text-sm mb-3">Don't see your model? We repair many more.</p>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-5 py-2.5 text-sm font-bold transition-colors">
                  WhatsApp for a Quote
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => setSelectedDevice(null)} className="flex items-center gap-1.5 text-[#777] hover:text-[#111] text-sm font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Change Model
                </button>
                <div className="bg-[#E31E24]/10 text-[#E31E24] px-4 py-1.5 rounded-full text-sm font-bold">
                  📱 {selectedDevice.name}
                </div>
              </div>
              <h2 className="font-display font-bold text-[#111] text-xl mb-5">What Needs Fixing?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service, i) => (
                  <motion.button key={service.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => navigate('/book', { state: { device: selectedDevice, service } })}
                    className="group text-left p-5 bg-[#F8F8F8] border-2 border-transparent hover:border-[#E31E24] hover:bg-white rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-[#E31E24]/10 group-hover:bg-[#E31E24] rounded-xl flex items-center justify-center transition-colors">
                        <Smartphone className="w-5 h-5 text-[#E31E24] group-hover:text-white transition-colors" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#E31E24] group-hover:translate-x-1 transition-all mt-1" />
                    </div>
                    <p className="font-display font-bold text-[#111] text-base mb-1">{service.name}</p>
                    <p className="text-[#777] text-xs">{service.short_description}</p>
                  </motion.button>
                ))}
              </div>
              <div className="mt-8 p-5 bg-[#111] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-white font-bold">Not sure what's wrong?</p>
                  <p className="text-white/60 text-sm">Send us a photo — free diagnosis.</p>
                </div>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl px-6 py-3 font-bold text-sm transition-colors whitespace-nowrap">
                  WhatsApp a Photo →
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

// Category page
function CategoryPage({ category }) {
  const { brands } = useBrandsData();
  const cat = CATEGORY_CONFIG[category];
  if (!cat) return <MainPage />;

  const catBrands = brands.filter(b => b.category === category);

  return (
    <div>
      <SEO title={`${cat.title} — HiFone Adelaide`}
        description={`${cat.title} repair in Kurralta Park. ${cat.items.join(', ')}.`} />

      <section className="py-14 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link to="/devices" className="hover:text-white transition-colors">All Devices</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{cat.title}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">{cat.title}</h1>
          <p className="text-white/60">{cat.subtitle}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
            {[
              { n: 1, label: 'Device Type', done: true },
              { n: 2, label: 'Brand', done: false },
              { n: 3, label: 'Model', done: false },
              { n: 4, label: 'Repair', done: false },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-center gap-2 shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.done ? 'bg-[#E31E24] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{s.n}</span>
                  {s.label}
                </div>
                {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Link to="/devices" className="flex items-center gap-1.5 text-[#777] hover:text-[#111] text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Devices
            </Link>
            <h2 className="font-display font-bold text-[#111] text-xl">Select Brand</h2>
          </div>

          {catBrands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catBrands.map((brand, i) => (
                <motion.div key={brand.brand}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <Link to={`/devices/${brand.routeKey}?from=${category}`}
                    className="group block bg-[#F8F8F8] border-2 border-transparent hover:border-[#E31E24] rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-36 overflow-hidden">
                      <img src={brand.image} alt={brand.brand} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cat.accentColor }} />
                      <p className="absolute bottom-3 left-4 font-display font-bold text-white text-lg">{brand.brand}</p>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-sm text-[#555] font-medium">{brand.count} models available</span>
                      <ArrowRight className="w-4 h-4 text-[#E31E24] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">{category === 'laptops' ? '💻' : '⌚'}</div>
              <h3 className="font-display font-bold text-[#111] text-2xl mb-3">{cat.title}</h3>
              <p className="text-[#555] mb-6 max-w-md mx-auto">We repair {cat.title.toLowerCase()}. WhatsApp us with your device model for a quick quote.</p>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-8 py-3 font-bold transition-colors">
                WhatsApp for a Quote →
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Main /devices
function MainPage() {
  const { brands } = useBrandsData();

  return (
    <div data-testid="devices-page">
      <SEO title="Device Repair — iPhone, Samsung, iPad, Laptop | HiFone Adelaide"
        description="We repair iPhones, Samsung, iPads, laptops and smart watches in Kurralta Park. Same-day service with warranty." />

      <section className="py-14 lg:py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <p className="text-overline mb-3">Step 1 of 4</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">What Device Do You Have?</h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">Select your device type to get started.</p>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {Object.entries(CATEGORY_CONFIG).map(([key, cat], i) => (
              <motion.div key={key}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/devices?category=${key}`}
                  className="group block bg-[#F8F8F8] border-2 border-transparent hover:border-[#E31E24] rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-44 overflow-hidden">
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cat.accentColor }} />
                    <h2 className="absolute bottom-4 left-5 right-5 font-display font-bold text-white text-xl leading-tight">{cat.title}</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {cat.items.map(item => (
                        <div key={item} className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cat.accentColor }} />
                          <span className="text-[#555] text-xs">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {brands.filter(b => b.category === key).slice(0, 4).map(b => (
                          <span key={b.brand} className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[#555]">{b.brand}</span>
                        ))}
                        {brands.filter(b => b.category === key).length > 4 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[#999]">
                            +{brands.filter(b => b.category === key).length - 4} more
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold flex items-center gap-1 shrink-0 ml-2" style={{ color: cat.accentColor }}>
                        Select Brand <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DevicesPage() {
  const { brand } = useParams();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const fromCategory = searchParams.get('from');

  if (brand) return <BrandPage brand={brand} fromCategory={fromCategory} />;
  if (category) return <CategoryPage category={category} />;
  return <MainPage />;
}