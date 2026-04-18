import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const WHATSAPP = 'https://wa.me/61432977092';

const trustBadges = [
  { icon: '⚡', text: 'Same-Day Repairs' },
  { icon: '🅿️', text: 'Free Parking' },
  { icon: '🛡️', text: '3–6 Month Warranty' },
  { icon: '✅', text: 'No Fix, No Fee' },
  { icon: '🏪', text: 'Kmart — 1 Min Walk' },
];

const trustSignals = [
  { icon: '⏱️', title: '30–60 Minutes', sub: 'Most repairs done' },
  { icon: '⭐', title: '500+ Customers', sub: '5.0 Google Rating' },
  { icon: '💰', title: 'Upfront Pricing', sub: 'No hidden fees' },
  { icon: '🔧', title: 'Certified Techs', sub: '5+ years experience' },
];

// Hero slider slides
const SLIDES = [
  {
    id: 1,
    tag: '💥 Real Repair — Our Workshop',
    headline: 'Cracked Screen?',
    highlight: 'Fixed Today',
    sub: 'Walk in anytime — no appointment needed. Most repairs done while you wait.',
    image: '/hero/before_screen.jpg',
    imageFit: 'object-cover object-center',
    badge: { label: 'No Fix, No Pay', color: 'bg-[#E31E24]' },
  },
  {
    id: 2,
    tag: '✨ Before & After — Real Results',
    headline: 'Like It Just',
    highlight: 'Came Out of the Box',
    sub: 'Drag the slider to see the real difference. Our work, not stock photos.',
    isBeforeAfter: true,
  },
  {
    id: 3,
    tag: '🔧 Back Glass Repair — Real Job',
    headline: 'We Fix What',
    highlight: "Others Can't",
    sub: 'Back glass, screens, batteries, water damage — all devices, same day.',
    image: '/hero/after_backglass.jpg',
    imageFit: 'object-cover object-center',
    badge: { label: '3–6 Month Warranty', color: 'bg-[#111111]' },
  },
];

// Real before/after from HiFone workshop
const BEFORE_IMG = '/hero/before_backglass.jpg'; // Cracked back glass iPhone
const AFTER_IMG = '/hero/after_repaired.jpg';   // Fixed iPhone next to old broken glass

const BeforeAfterSlide = () => {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useState(null);

  const handleMove = (e) => {
    if (!dragging) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.min(95, Math.max(5, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden cursor-ew-resize select-none"
      onMouseMove={handleMove}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={handleMove}
      onTouchStart={() => setDragging(true)}
      onTouchEnd={() => setDragging(false)}
    >
      {/* AFTER full image */}
      <img
        src={AFTER_IMG}
        alt="Phone after repair"
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />
      {/* BEFORE clipped on left side */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={BEFORE_IMG}
          alt="Phone before repair - cracked screen"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
      </div>
      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
        style={{ left: `${pos}%` }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border border-gray-200">
          <ChevronLeft className="w-3.5 h-3.5 text-[#333]" />
          <ChevronRight className="w-3.5 h-3.5 text-[#333]" />
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm text-white text-xs font-black px-4 py-2 rounded-full tracking-widest flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
        CRACKED
      </div>
      <div className="absolute top-4 right-4 bg-[#E31E24] text-white text-xs font-black px-4 py-2 rounded-full tracking-widest flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-white inline-block" />
        REPAIRED ✓
      </div>
      {/* Drag hint — animated pulse */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 animate-pulse">
        <span>👈</span> Drag to compare <span>👉</span>
      </div>
    </div>
  );
};

export const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setCurrent(c => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => {
    setDir(i > current ? 1 : -1);
    setCurrent(i);
  };
  const prev = () => { setDir(-1); setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length); };
  const next = () => { setDir(1); setCurrent(c => (c + 1) % SLIDES.length); };

  const slide = SLIDES[current];

  const variants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section className="relative bg-[#111111] overflow-hidden" data-testid="hero-section">
      <div className="h-1 w-full bg-[#E31E24]" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-20 lg:pt-24 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 items-center pb-12 lg:pb-20">

          {/* LEFT — Content (static, always visible) */}
          <div className="order-1 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#E31E24]/20 border border-[#E31E24]/40 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#ffffff] animate-pulse" />
              <span className="text-[#ffffff] text-xs font-bold uppercase tracking-wider">Kurralta Park, Adelaide</span>
            </motion.div>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <div className="inline-block bg-[#E31E24]/20 text-[#ffffff] text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {slide.tag}
                </div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.2rem] font-bold text-white leading-[1.1] tracking-tight mb-5">
                  {slide.headline}<br />
                  <span className="text-[#E31E24]">{slide.highlight}</span>
                </h1>
                <p className="text-white/60 text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
                  {slide.sub}
                </p>
              </motion.div>
            </AnimatePresence>
            {/* Mobile image — shows between headline and buttons */}
            <div className="block lg:hidden relative h-[260px] -mx-4 mb-6 mt-2">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={current}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  {slide.isBeforeAfter ? (
                    <BeforeAfterSlide />
                  ) : (
                    <img
                      src={slide.image}
                      alt={slide.tag}
                      className={`w-full h-full ${slide.imageFit} rounded-2xl`}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                to="/book"
                className="flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-[#C01017] text-white rounded-full px-8 h-14 text-base font-bold transition-colors press-effect shadow-[0_4px_24px_rgba(227,30,36,0.4)]"
              >
                Book a Repair <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-8 h-14 text-base font-bold transition-colors press-effect"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp Now
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {trustBadges.map((b) => (
                <div key={b.text} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                  <span>{b.icon}</span>
                  <span className="text-white/70 text-xs font-semibold">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Slider dots + arrows */}
            <div className="flex items-center gap-3 mt-8">
              <button onClick={prev} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#E31E24]' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
              <button onClick={next} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT — Animated image/before-after */}
          <div className="relative hidden lg:block order-2 lg:order-2 h-[480px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                {slide.isBeforeAfter ? (
                  <BeforeAfterSlide />
                ) : (
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-[#E31E24]/10 rounded-full blur-3xl scale-75" />
                    <img
                      src={slide.image}
                      alt={slide.tag}
                      className={`relative w-full h-full ${slide.imageFit} rounded-3xl`}
                    />
                    {/* Floating badges */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E31E24]/10 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-[#E31E24]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Our Guarantee</p>
                          <p className="text-sm font-bold text-[#111111]">No Fix, No Pay</p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className={`absolute -top-4 -right-4 ${slide.badge?.color || 'bg-[#E31E24]'} rounded-2xl px-5 py-3 shadow-xl`}
                    >
                      <p className="text-white text-xs font-semibold opacity-80">⭐ Customers say</p>
                      <p className="text-white text-base font-bold">{slide.badge?.label || 'Same Day Fix'}</p>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Trust Signals Bar */}
      <div className="border-t border-white/10 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {trustSignals.map((item) => (
              <div key={item.title} className="flex items-center gap-3 px-6 py-5">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  <p className="text-white/50 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;