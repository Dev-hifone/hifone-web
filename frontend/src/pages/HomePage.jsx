import { useEffect, useState } from 'react';
import { Hero } from '../components/home/Hero';
import { ServicesGrid } from '../components/home/ServicesGrid';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { Testimonials } from '../components/home/Testimonials';
import { FinalCTA } from '../components/home/FinalCTA';
import { FAQ } from '../components/home/FAQ';
import { SEO } from '../components/SEO';
import { settingsApi, blogApi } from '../lib/api';
import { MapPin, Phone, Clock, Car, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Real store photos — upload these to frontend/public/store/
const STORE_PHOTOS = [
  { src: '/store/shop_kiosk_main.jpg', alt: 'HiFone repair kiosk at Kurralta Park Village' },
  { src: '/store/shop_kiosk_side.jpg', alt: 'HiFone accessories and repairs display' },
  { src: '/store/shop_entrance.jpg',   alt: 'HiFone store entrance at Kurralta Park' },
  { src: '/store/shop_kmart_view.jpg', alt: 'HiFone kiosk — Kmart just steps away' },
  { src: '/store/shop_wide.jpg',       alt: 'HiFone inside Kurralta Park Village shopping centre' },
  { src: '/store/shop_parking.jpg',    alt: 'Free parking outside HiFone Kurralta Park' },
];

const StoreLocation = ({ settings }) => {
  const [activePhoto, setActivePhoto] = useState(0);
  if (!settings) return null;
  return (
    <section className="py-20 bg-white" data-testid="homepage-map-section">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-overline mb-3">Find Us</p>
          <h2 className="text-h2 mb-3">Visit Our Store</h2>
          <p className="text-[#555555] mb-4">Inside Kurralta Park Village Shopping Centre</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-[#E31E24]/10 border border-[#E31E24]/20 rounded-full px-4 py-2 text-[#E31E24] text-sm font-bold">
              <Car className="w-4 h-4" />Free Parking Available
            </div>
            <div className="inline-flex items-center gap-2 bg-[#111111]/5 border border-[#111111]/10 rounded-full px-4 py-2 text-[#111111] text-sm font-bold">
              🏪 Kmart — 1 Min Walk
            </div>
            <div className="inline-flex items-center gap-2 bg-[#111111]/5 border border-[#111111]/10 rounded-full px-4 py-2 text-[#111111] text-sm font-bold">
              💊 TerryWhite Chemist Nearby
            </div>
          </div>
        </motion.div>

        {/* Store Photo Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          {/* Main photo */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] mb-3 bg-[#F8F8F8]">
            <img
              src={STORE_PHOTOS[activePhoto].src}
              alt={STORE_PHOTOS[activePhoto].alt}
              className="w-full h-full object-cover object-center"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
              {STORE_PHOTOS[activePhoto].alt}
            </div>
          </div>
          {/* Thumbnail strip */}
          <div className="grid grid-cols-6 gap-2">
            {STORE_PHOTOS.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                className={`relative rounded-xl overflow-hidden aspect-square bg-[#F8F8F8] border-2 transition-all ${i === activePhoto ? 'border-[#E31E24]' : 'border-transparent hover:border-[#E31E24]/50'}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Map + Info */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              src={settings.google_maps_embed || ''}
              width="100%" height="350"
              style={{ border: 0 }} allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="HiFone Store Location"
            />
          </div>
          <div className="lg:col-span-2 space-y-4">
            {[
              { Icon: MapPin, label: 'Address', value: settings.address, isLink: false },
              { Icon: Phone, label: 'Phone', value: settings.phone, isLink: true, href: `tel:${(settings.phone||'').replace(/\s/g,'')}` },
              { Icon: Clock, label: 'Hours', value: `${settings.hours_weekday} · ${settings.hours_weekend}`, isLink: false },
              { Icon: Car, label: 'Parking', value: 'Free parking right at the store — no stress, no meters', isLink: false },
            ].map(({ Icon, label, value, isLink, href }) => (
              <div key={label} className="flex items-start gap-4 p-4 bg-[#F8F8F8] rounded-2xl">
                <div className="w-10 h-10 bg-[#E31E24]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#E31E24]" />
                </div>
                <div>
                  <p className="font-bold text-[#111111] text-sm">{label}</p>
                  {isLink ? (
                    <a href={href} className="text-[#E31E24] hover:underline text-sm">{value}</a>
                  ) : (
                    <p className="text-[#555555] text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


const BlogPreview = () => {
  const [blogs, setBlogs] = useState([]);
  const PLACEHOLDERS = [
    { id: '1', title: 'How to Protect Your Phone Screen', slug: 'protect-phone-screen', excerpt: 'Best practices to keep your screen safe from cracks.', created_at: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&q=80' },
    { id: '2', title: '5 Signs Your Battery Needs Replacing', slug: 'battery-replacement-signs', excerpt: 'Is your phone dying fast? These signs say yes.', created_at: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80' },
    { id: '3', title: 'What to Do After Water Damage', slug: 'water-damage-guide', excerpt: 'Quick steps to save your phone after a swim.', created_at: new Date().toISOString(), image_url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80' },
  ];

  useEffect(() => {
    blogApi.getAll()
      .then(res => setBlogs(res.data?.length ? res.data.slice(0, 3) : PLACEHOLDERS))
      .catch(() => setBlogs(PLACEHOLDERS));
  }, []);

  const fmt = (d) => { try { return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return ''; } };

  if (!blogs.length) return null;

  return (
    <section className="py-20 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
          <div>
            <p className="text-overline mb-2">From Our Blog</p>
            <h2 className="text-h2">Tips & Guides</h2>
          </div>
          <Link to="/blog" className="hidden sm:inline-flex items-center gap-2 text-[#E31E24] font-bold text-sm hover:gap-3 transition-all">
            All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {blogs.map((blog, i) => (
            <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to={`/blog/${blog.slug}`} className="group block bg-white border-2 border-transparent hover:border-[#E31E24] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-video overflow-hidden bg-[#E5E5E5]">
                  {blog.image_url
                    ? <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">📱</div>
                  }
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-[#999999] mb-2">
                    <Calendar className="w-3 h-3" />{fmt(blog.created_at)}
                  </div>
                  <h3 className="font-display font-bold text-[#111111] group-hover:text-[#E31E24] transition-colors text-base line-clamp-2 mb-1">{blog.title}</h3>
                  <p className="text-[#777777] text-xs line-clamp-2">{blog.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#E31E24] font-bold text-sm">All Posts <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsApi.get().then(res => setSettings(res.data)).catch(() => {
      setSettings({
        address: 'Shop 153 Anzac Hwy, Kurralta Park SA 5037',
        phone: '0432 977 092',
        hours_weekday: 'Monday – Saturday: 9am – 6pm',
        hours_weekend: 'Sunday: Closed',
        google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.2!2d138.5722!3d-34.9456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKurralta+Park!5e0!3m2!1sen!2sau!4v1',
      });
    });
  }, []);

  return (
    <div data-testid="home-page" className="pb-16 lg:pb-0">
      <SEO
        title="Best Mobile Phone Repairs in Kurralta Park, Adelaide | HiFone"
        description="HiFone — Kurralta Park's fastest phone repair shop. iPhone, Samsung, iPad, Laptop repairs. Same-day service, 3–6 month warranty, no fix no fee."
        keywords="phone repair adelaide, iphone repair kurralta park, samsung repair adelaide, screen repair, battery replacement, laptop repair adelaide"
      />
      <Hero />
      <ServicesGrid />
      <WhyChooseUs />
      <Testimonials />
      <StoreLocation settings={settings} />
      <FAQ />
      <BlogPreview />
      <FinalCTA />
    </div>
  );
}
