import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';

const WHATSAPP = 'https://wa.me/61432977092?text=Hi%2C%20I%27m%20interested%20in%20your%20accessories!';

const COMING_ITEMS = [
  { emoji: '📱', label: 'Phone Cases' },
  { emoji: '🔌', label: 'Chargers & Cables' },
  { emoji: '🎧', label: 'Earphones' },
  { emoji: '🔋', label: 'Power Banks' },
  { emoji: '💻', label: 'Laptop Bags' },
  { emoji: '🛡️', label: 'Screen Protectors' },
  { emoji: '⌚', label: 'Watch Bands' },
  { emoji: '🎮', label: 'Gaming Accessories' },
];

export default function AccessoriesPage() {
  return (
    <div className="min-h-screen bg-[#111111]" data-testid="accessories-page">
      <SEO
        title="Accessories — Coming Soon | HiFone Adelaide"
        description="Phone cases, chargers, screen protectors and more. Coming soon to HiFone Kurralta Park."
        noIndex={true}
      />

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <section className="flex flex-col items-center justify-center px-4 py-4 text-center">
        {/* Animated emoji */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-8xl mb-8"
        >
          🛍️
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-[#E31E24]/20 border border-[#E31E24]/40 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse" />
          <span className="text-[#E31E24] text-xs font-bold uppercase tracking-wider">Coming Soon</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-5xl sm:text-6xl font-bold text-white mb-4"
        >
          Accessories
          <span className="block text-[#E31E24]">Shop</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-lg max-w-md mb-12"
        >
          We're building our online accessories store. In the meantime, visit us in-store or WhatsApp to check availability.
        </motion.p>

        {/* Items grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12 max-w-2xl w-full"
        >
          {COMING_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 hover:border-[#E31E24]/40 transition-all"
            >
              <div className="text-3xl mb-2">{item.emoji}</div>
              <p className="text-white/70 text-xs font-medium">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-8 h-14 text-base font-bold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp to Check Stock
          </a>
          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-8 h-14 text-base font-bold transition-colors"
          >
            Visit Us In-Store
          </Link>
        </motion.div>

        {/* Address */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/30 text-sm mt-8"
        >
          📍 Shop 153 Anzac Hwy, Kurralta Park SA 5037
        </motion.p>
      </section>
    </div>
  );
}
