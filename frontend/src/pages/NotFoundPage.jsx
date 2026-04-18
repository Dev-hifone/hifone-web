import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle, Wrench, Home } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Button } from '../components/ui/button';

const popularRepairs = [
  { label: 'iPhone Screen Repair', slug: 'iphone-14-screen-repair-adelaide' },
  { label: 'Samsung Screen Repair', slug: 'samsung-s24-screen-repair-adelaide' },
  { label: 'iPhone Battery Replacement', slug: 'iphone-14-battery-replacement-adelaide' },
  { label: 'Water Damage Repair', slug: 'iphone-14-water-damage-repair-adelaide' },
  { label: 'iPad Screen Repair', slug: 'ipad-pro-screen-repair-adelaide' },
  { label: 'Charging Port Repair', slug: 'iphone-14-charging-port-repair-adelaide' },
];

const quickLinks = [
  { label: 'All Services', href: '/services' },
  { label: 'All Devices', href: '/devices' },
  { label: 'Book a Repair', href: '/book' },
  { label: 'Contact Us', href: '/contact' },
];

export default function NotFoundPage() {
  return (
    <div data-testid="not-found-page">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Browse HiFone's repair services for iPhone, Samsung, iPad and more in Kurralta Park, Adelaide."
        noIndex
      />

      {/* Hero */}
      <section className="bg-[#111111] pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Big 404 */}
            <div className="relative inline-block mb-6">
              <span className="font-display text-[120px] sm:text-[160px] font-bold text-white/5 leading-none select-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E31E24]/10 flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-[#E31E24]" />
                </div>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Page Not Found
            </h1>
            <p className="text-white/50 text-lg max-w-md mx-auto mb-8">
              Looks like this page took a drop — like a phone without a case. Let's get you back on track.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/">
                <Button
                  size="lg"
                  className="bg-[#E31E24] hover:bg-[#c8171d] text-white rounded-full px-8 py-6 text-base font-medium w-full sm:w-auto"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/book">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent hover:bg-white/10 text-white rounded-full px-8 py-6 text-base font-medium w-full sm:w-auto"
                >
                  Book a Repair
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Repairs */}
      <section className="py-16 lg:py-20 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E31E24] block mb-3">
              Popular Repairs
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
              What were you looking for?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {popularRepairs.map((repair, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
              >
                <Link
                  to={`/${repair.slug}`}
                  className="group flex items-center gap-3 p-5 bg-white rounded-2xl border border-black/[0.04] hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:border-[#E31E24]/20 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E31E24]/10 flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4 text-[#E31E24]" />
                  </div>
                  <span className="font-medium text-[#1D1D1F] text-sm group-hover:text-[#E31E24] transition-colors">
                    {repair.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#86868B] ml-auto group-hover:text-[#E31E24] group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick links row */}
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((link, idx) => (
              <Link key={idx} to={link.href}>
                <Button
                  variant="outline"
                  className="rounded-full px-5 py-2 text-sm border-black/10 text-[#1D1D1F] hover:border-[#E31E24] hover:text-[#E31E24] transition-colors"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-12 bg-white border-t border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-lg font-semibold text-[#1D1D1F]">
                Still can't find what you need?
              </p>
              <p className="text-sm text-[#86868B] mt-1">
                Call us or WhatsApp — we'll help you straight away.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="tel:0432977092">
                <Button
                  variant="outline"
                  className="rounded-full px-6 border-black/10 w-full sm:w-auto"
                >
                  <Phone className="w-4 h-4 mr-2 text-[#E31E24]" />
                  0432 977 092
                </Button>
              </a>
              <a
                href="https://wa.me/61432977092?text=Hi! I need help with a repair."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full px-6 w-full sm:w-auto">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}