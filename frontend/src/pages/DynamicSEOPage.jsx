import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Clock, CheckCircle, Phone, MessageCircle,
  MapPin, Wrench, Star, ChevronDown, ChevronRight, Smartphone, AlertCircle,
} from 'lucide-react';
import { seoApi, serviceApi, deviceApi } from '../lib/api';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/button';
import { SEO } from '../components/SEO';

// ── Slug Parsing ────────────────────────────────────────────────────────────

const KNOWN_DEVICE_SLUGS = [
  'iphone-15-pro', 'iphone-15', 'iphone-14-pro', 'iphone-14',
  'iphone-13-pro', 'iphone-13', 'iphone-12', 'iphone-se',
  'samsung-s24-ultra', 'samsung-s24', 'samsung-s23-ultra', 'samsung-s23',
  'samsung-s22', 'samsung-a54', 'samsung-z-flip-5', 'samsung-z-fold-5',
  'ipad-pro', 'ipad-air', 'ipad-10', 'ipad-mini',
  'pixel-8-pro', 'pixel-8', 'pixel-7',
];

const KNOWN_SERVICE_SLUGS = [
  'screen-repair', 'battery-replacement', 'water-damage-repair',
  'charging-port-repair', 'camera-repair', 'speaker-mic-repair',
];

const KNOWN_LOCATIONS = ['adelaide', 'kurralta-park'];

function parseSlug(slug) {
  if (!slug) return null;
  const s = slug.toLowerCase();

  // Find device slug (longest match first)
  const sortedDevices = [...KNOWN_DEVICE_SLUGS].sort((a, b) => b.length - a.length);
  let deviceSlug = null;
  for (const ds of sortedDevices) {
    if (s.startsWith(ds)) {
      deviceSlug = ds;
      break;
    }
  }

  // Find service slug
  let serviceSlug = null;
  for (const ss of KNOWN_SERVICE_SLUGS) {
    if (s.includes(ss)) {
      serviceSlug = ss;
      break;
    }
  }

  // Find location
  let location = 'adelaide';
  for (const loc of KNOWN_LOCATIONS) {
    if (s.includes(loc)) {
      location = loc;
      break;
    }
  }

  if (!deviceSlug || !serviceSlug) return null;

  return { deviceSlug, serviceSlug, location };
}

// ── Dynamic FAQ Data (per-service) ──────────────────────────────────────────

function getServiceFAQs(serviceName, deviceName, location, repairTime, warranty) {
  return [
    {
      question: `How long does ${serviceName.toLowerCase()} take for ${deviceName}?`,
      answer: `Most ${serviceName.toLowerCase()} jobs for the ${deviceName} are completed within ${repairTime || '30-60 minutes'}. We work while you wait, so you can get back to using your device as quickly as possible.`,
    },
    {
      question: `Is there a warranty on the ${deviceName} ${serviceName.toLowerCase()}?`,
      answer: `Yes! All our ${serviceName.toLowerCase()} repairs come with a comprehensive ${warranty || '90 days'} warranty covering both parts and labour. If you experience any issues related to the repair within this period, we'll fix it free of charge.`,
    },
    {
      question: `Do you use original parts for ${deviceName} repairs?`,
      answer: `We use only premium quality replacement parts that meet or exceed OEM specifications. Every part is thoroughly tested before installation to ensure optimal performance and longevity for your ${deviceName}.`,
    },
    {
      question: `What if you can't fix my ${deviceName}?`,
      answer: `We operate on a strict "No Fix, No Pay" policy. If we're unable to repair your ${deviceName}, you won't be charged a single cent. We provide a free diagnosis to assess the issue before proceeding.`,
    },
    {
      question: `Do I need to book an appointment for ${serviceName.toLowerCase()}?`,
      answer: `While walk-ins are welcome at our ${location} location, we recommend booking an appointment to ensure minimal wait times. You can book online through our website or call us at 0432 977 092.`,
    },
    {
      question: `How much does ${deviceName} ${serviceName.toLowerCase()} cost in ${location}?`,
      answer: `Our ${deviceName} ${serviceName.toLowerCase()} pricing is competitive and transparent. You can see the exact price on this page before booking. We never add hidden fees or surprise charges.`,
    },
  ];
}

// ── Section Components ──────────────────────────────────────────────────────

function HeroSection({ device, service, pricing, location, slug }) {
  return (
    <section className="pt-8 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-b from-[#F5F5F7] to-white" data-testid="seo-hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb" data-testid="seo-breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[#86868B]">
            <li><Link to="/" className="hover:text-[#E31E24] transition-colors">Home</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link to="/services" className="hover:text-[#E31E24] transition-colors">Services</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link to={`/devices`} className="hover:text-[#E31E24] transition-colors">{device.brand}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-[#1D1D1F] font-medium">{device.name} {service.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left — Content (3 cols) */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#34C759]/10 text-[#34C759] rounded-full mb-6">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Same-Day Repair Available</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1D1D1F] tracking-tighter leading-tight mb-6" data-testid="seo-h1">
              {device.name} {service.name}
              <br />
              <span className="text-[#E31E24]">in {location.name}</span>
            </h1>

            <p className="text-lg text-[#86868B] leading-relaxed mb-8 max-w-2xl">
              Same-day repair with warranty included. Affordable pricing, premium parts, and expert technicians at {location.full_name}.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10" data-testid="seo-cta-buttons">
              <Link to="/book" state={{ device: { id: device.id, name: device.name, brand: device.brand }, service }}>
                <Button
                  size="lg"
                  className="bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-full px-8 py-6 text-base font-medium w-full sm:w-auto"
                  data-testid="seo-book-btn"
                >
                  Book Repair
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="tel:0432977092">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base font-medium border-[#1D1D1F]/15 w-full sm:w-auto"
                  data-testid="seo-call-btn"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  0432 977 092
                </Button>
              </a>
            </div>

            {/* Trust indicators row */}
            <div className="flex flex-wrap gap-6 text-sm text-[#86868B]">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#E31E24]" /> {pricing?.repair_time || '30-60 min'}</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#34C759]" /> {pricing?.warranty || '90 days'} Warranty</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[#FF9500]" /> No Fix, No Pay</span>
            </div>
          </div>

          {/* Right — Price card (2 cols) */}
          <div className="lg:col-span-2" data-testid="seo-price-card">
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-black/[0.04] sticky top-24">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#E31E24] mb-3">Repair Price</div>

              <div className="flex items-end gap-3 mb-1">
                <span className="font-display text-5xl font-semibold text-[#1D1D1F] tracking-tight" data-testid="seo-price">
                  {pricing ? formatPrice(pricing.price) : 'Get Quote'}
                </span>
              </div>
              {pricing?.original_price && pricing.original_price > pricing.price && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#86868B] line-through text-lg">{formatPrice(pricing.original_price)}</span>
                  <span className="text-xs font-semibold text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full">
                    Save {formatPrice(pricing.original_price - pricing.price)}
                  </span>
                </div>
              )}

              <div className="space-y-3 mt-6 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-[#E31E24]" />
                  <span className="text-[#1D1D1F]">Repair Time: <strong>{pricing?.repair_time || 'Same Day'}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-[#34C759]" />
                  <span className="text-[#1D1D1F]">Warranty: <strong>{pricing?.warranty || '90 days'}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Wrench className="w-4 h-4 text-[#FF9500]" />
                  <span className="text-[#1D1D1F]">Premium parts included</span>
                </div>
              </div>

              <Link to="/book" state={{ device: { id: device.id, name: device.name, brand: device.brand }, service }} className="block">
                <Button
                  size="lg"
                  className="w-full bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-full py-6 text-base font-medium"
                  data-testid="seo-price-card-book-btn"
                >
                  Book This Repair
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              {/* Star rating */}
              <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-black/[0.04]">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FF9500] fill-[#FF9500]" />
                  ))}
                </div>
                <span className="text-sm text-[#1D1D1F] font-medium">5.0</span>
                <span className="text-sm text-[#86868B]">on Google</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceDetailsSection({ service, serviceDetails, deviceName }) {
  return (
    <section className="py-16 lg:py-20 bg-white" data-testid="seo-service-details">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-12">
          What's Included in {deviceName} {service.name}
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* What's included */}
          <div>
            <h3 className="font-display text-xl font-medium text-[#1D1D1F] mb-6 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#E31E24]" />
              Repair Includes
            </h3>
            <ul className="space-y-4" data-testid="seo-includes-list">
              {(serviceDetails.includes || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#34C759] mt-0.5 shrink-0" />
                  <span className="text-[#1D1D1F]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common issues */}
          <div>
            <h3 className="font-display text-xl font-medium text-[#1D1D1F] mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#FF9500]" />
              Common Issues We Fix
            </h3>
            <ul className="space-y-4" data-testid="seo-issues-list">
              {(serviceDetails.common_issues || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-[#86868B] mt-0.5 shrink-0" />
                  <span className="text-[#86868B]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service description prose */}
        <div className="mt-12 pt-10 border-t border-black/[0.04]">
          <p className="text-[#86868B] leading-relaxed max-w-3xl">
            {service.description} Our expert technicians have years of experience working with {deviceName} devices 
            and use only premium quality parts to ensure your device functions like new. Most repairs are 
            completed the same day you bring your device in.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection({ deviceName }) {
  const reasons = [
    { icon: Clock, title: 'Same-Day Repair', desc: 'Most repairs completed within 30-60 minutes while you wait. No need to be without your device for days.' },
    { icon: Shield, title: 'Warranty Included', desc: 'Every repair comes with our comprehensive warranty. If anything goes wrong, we fix it for free.' },
    { icon: Wrench, title: 'Certified Technicians', desc: 'Our experienced team specialises in device repairs with thousands of successful fixes.' },
    { icon: CheckCircle, title: 'No Fix, No Pay', desc: "If we can't repair your device, you don't pay. Free diagnosis with every repair enquiry." },
    { icon: Star, title: '5-Star Rated', desc: 'Rated 5.0 on Google Reviews. Our customers trust us with their devices and recommend us.' },
    { icon: Smartphone, title: 'Premium Parts', desc: 'We only use high-quality replacement parts that meet or exceed OEM specifications.' },
  ];

  return (
    <section className="py-16 lg:py-20 bg-[#F5F5F7]" data-testid="seo-why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E31E24] block mb-3">Why HiFone</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            Why Choose Us for Your {deviceName} Repair
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-black/[0.04]" data-testid={`why-choose-card-${idx}`}>
              <div className="w-10 h-10 rounded-xl bg-[#E31E24]/10 flex items-center justify-center mb-4">
                <r.icon className="w-5 h-5 text-[#E31E24]" />
              </div>
              <h3 className="font-display text-lg font-medium text-[#1D1D1F] mb-2">{r.title}</h3>
              <p className="text-sm text-[#86868B] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection({ location, deviceName, serviceName }) {
  return (
    <section className="py-16 lg:py-20 bg-white" data-testid="seo-location-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E31E24] block mb-3">Our Location</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-6">
              Serving {location.name} &amp; Surrounding Areas
            </h2>
            <p className="text-[#86868B] leading-relaxed mb-6">
              {location.description}
            </p>
            <p className="text-[#86868B] leading-relaxed mb-8">
              Whether you need {serviceName.toLowerCase()} for your {deviceName} or any other mobile repair, 
              our {location.full_name} workshop is conveniently located and easy to find. 
              Drop in during business hours or book an appointment online.
            </p>

            <div className="flex items-center gap-3 text-[#1D1D1F] font-medium mb-6">
              <MapPin className="w-5 h-5 text-[#E31E24]" />
              <span>{location.full_name}, {location.state} {location.postcode}</span>
            </div>

            <div className="flex flex-wrap gap-2" data-testid="seo-areas-served">
              {(location.areas_served || []).map((area, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-[#F5F5F7] rounded-full text-xs font-medium text-[#86868B]">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Map / visual */}
          <div className="bg-[#F5F5F7] rounded-2xl p-8 aspect-square flex flex-col items-center justify-center text-center">
            <MapPin className="w-12 h-12 text-[#E31E24] mb-4" />
            <h3 className="font-display text-xl font-medium text-[#1D1D1F] mb-2">{location.full_name}</h3>
            <p className="text-sm text-[#86868B] mb-4">{location.state} {location.postcode}, Australia</p>
            <p className="text-sm text-[#86868B]">Mon–Sat: 9am – 6pm</p>
            <a
              href="https://maps.google.com/?q=Kurralta+Park+Adelaide+SA+5037"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6"
            >
              <Button variant="outline" className="rounded-full text-sm px-6" data-testid="seo-directions-btn">
                Get Directions
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection({ faqs, deviceName, serviceName }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 lg:py-20 bg-[#F5F5F7]" data-testid="seo-faq-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E31E24] block mb-3">FAQ</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
            {deviceName} {serviceName} Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-black/[0.04] overflow-hidden"
              data-testid={`seo-faq-item-${idx}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left"
                aria-expanded={openIndex === idx}
              >
                <span className="font-medium text-[#1D1D1F] pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#86868B] shrink-0 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-[#86868B] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedRepairsSection({ relatedServices, relatedDevices, deviceName, serviceName }) {
  return (
    <section className="py-16 lg:py-20 bg-white" data-testid="seo-related-repairs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Related services for the same device */}
        {relatedServices.length > 0 && (
          <div className="mb-14">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight mb-8">
              Other {deviceName} Repairs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedServices.map((rs, idx) => (
                <Link
                  key={idx}
                  to={`/${rs.seo_slug}`}
                  className="group p-5 bg-[#F5F5F7] rounded-xl hover:bg-white hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-200 border border-transparent hover:border-black/[0.04]"
                  data-testid={`related-service-${idx}`}
                >
                  <div className="font-medium text-sm text-[#1D1D1F] mb-1">{rs.service_name}</div>
                  <div className="text-xs text-[#86868B] mb-2">{rs.repair_time}</div>
                  <div className="font-display text-lg font-semibold text-[#E31E24]">{formatPrice(rs.price)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Same service on related devices */}
        {relatedDevices.length > 0 && (
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight mb-8">
              {serviceName} for Other Devices
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedDevices.map((rd, idx) => (
                <Link
                  key={idx}
                  to={`/${rd.seo_slug}`}
                  className="group p-5 bg-[#F5F5F7] rounded-xl hover:bg-white hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-200 border border-transparent hover:border-black/[0.04]"
                  data-testid={`related-device-${idx}`}
                >
                  <div className="text-xs text-[#86868B] mb-1">{rd.brand}</div>
                  <div className="font-medium text-sm text-[#1D1D1F] mb-2">{rd.device_name}</div>
                  <div className="font-display text-lg font-semibold text-[#E31E24]">{formatPrice(rd.price)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Internal links */}
        <div className="mt-12 pt-10 border-t border-black/[0.04] flex flex-wrap gap-4 text-sm" data-testid="seo-internal-links">
          <Link to="/services" className="text-[#E31E24] hover:underline flex items-center gap-1">
            All Services <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/devices" className="text-[#E31E24] hover:underline flex items-center gap-1">
            All Devices <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/book" className="text-[#E31E24] hover:underline flex items-center gap-1">
            Book a Repair <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/contact" className="text-[#E31E24] hover:underline flex items-center gap-1">
            Contact Us <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection({ deviceName, serviceName }) {
  return (
    <section className="py-16 lg:py-20 bg-[#1D1D1F]" data-testid="seo-final-cta">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
          Book Your {deviceName} Repair Today
        </h2>
        <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
          Don't wait — the longer you delay, the worse the damage can get. Get your {serviceName.toLowerCase()} done today with our same-day service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/book">
            <Button
              size="lg"
              className="bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-full px-10 py-6 text-base font-medium"
              data-testid="seo-final-book-btn"
            >
              Book Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a href="https://wa.me/61432977092?text=Hi! I need help with my phone repair." target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent hover:bg-white/10 text-white rounded-full px-10 py-6 text-base font-medium"
              data-testid="seo-final-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Us
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Error / Fallback Page ───────────────────────────────────────────────────

function NotFoundFallback() {
  const [allServices, setAllServices] = useState([]);
  const [allDevices, setAllDevices] = useState([]);

  useEffect(() => {
    serviceApi.getAll().then(r => setAllServices(r.data || [])).catch(() => {});
    deviceApi.getAll().then(r => setAllDevices(r.data || [])).catch(() => {});
  }, []);

  const popularSlugs = [
    { label: 'iPhone 15 Pro Screen Repair', slug: 'iphone-15-pro-screen-repair-adelaide' },
    { label: 'iPhone 13 Battery Replacement', slug: 'iphone-13-battery-replacement-adelaide' },
    { label: 'Samsung S24 Screen Repair', slug: 'samsung-s24-screen-repair-adelaide' },
    { label: 'iPad Pro Screen Repair', slug: 'ipad-pro-screen-repair-adelaide' },
    { label: 'Pixel 8 Camera Repair', slug: 'pixel-8-camera-repair-adelaide' },
  ];

  return (
    <div className="min-h-[60vh] bg-[#F5F5F7] py-20" data-testid="seo-not-found">
      <SEO title="Page Not Found" description="The repair page you're looking for doesn't exist. Browse our services and devices." noIndex />
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-[#FF3B30]" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-[#1D1D1F] mb-3">Repair Page Not Found</h1>
        <p className="text-[#86868B] mb-10">
          We couldn't find the specific repair page you're looking for. Try one of our popular repairs below or browse all services.
        </p>

        {/* Popular repair links */}
        <div className="grid sm:grid-cols-2 gap-3 mb-10 text-left">
          {popularSlugs.map((ps, idx) => (
            <Link
              key={idx}
              to={`/${ps.slug}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow border border-black/[0.04]"
            >
              <ArrowRight className="w-4 h-4 text-[#E31E24]" />
              <span className="text-sm font-medium text-[#1D1D1F]">{ps.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/services">
            <Button className="bg-[#E31E24] hover:bg-[#E31E24] text-white rounded-full px-6" data-testid="fallback-services-btn">
              Browse Services
            </Button>
          </Link>
          <Link to="/devices">
            <Button variant="outline" className="rounded-full px-6" data-testid="fallback-devices-btn">
              Browse Devices
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="rounded-full px-6" data-testid="fallback-home-btn">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function DynamicSEOPage() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      const parsed = parseSlug(slug);
      if (!parsed) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await seoApi.getPageData(parsed.deviceSlug, parsed.serviceSlug, parsed.location);
        setPageData(res.data);
      } catch (err) {
        console.error('SEO page data fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [slug]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#F5F5F7] flex items-center justify-center" data-testid="seo-loading">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#86868B]">Loading repair details...</span>
        </div>
      </div>
    );
  }

  // ── Error / Not Found ──
  if (error || !pageData) {
    return <NotFoundFallback />;
  }

  const { device, service, pricing, location, service_details, related_services, related_devices } = pageData;
  const deviceName = device.name;
  const serviceName = service.name;

  // Dynamic FAQ
  const faqs = getServiceFAQs(serviceName, deviceName, location.name, pricing?.repair_time, pricing?.warranty);

  // SEO props
  const pageTitle = `${deviceName} ${serviceName} in ${location.name}`;
  const pageDescription = `Get ${deviceName} ${serviceName.toLowerCase()} in ${location.name} with same-day service and warranty. Premium parts, expert technicians, no fix no pay. Book now at HiFone.`;

  return (
    <div data-testid="seo-page">
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${deviceName} ${serviceName.toLowerCase()} ${location.name}, ${device.brand.toLowerCase()} repair ${location.name.toLowerCase()}, phone repair near me, mobile repair ${location.name.toLowerCase()}, ${serviceName.toLowerCase()} cost ${location.name.toLowerCase()}`}
url={`${import.meta.env.VITE_SITE_URL || 'https://hifone.com.au'}/${slug}`}
        service={{ name: serviceName, description: service.description, price: pricing?.price }}
        device={device}
        location={location.name}
        faqs={faqs}
      />

      {/* 1. Hero + Price */}
      <HeroSection device={device} service={service} pricing={pricing} location={location} slug={slug} />

      {/* 2. Service Details (includes + common issues) */}
      <ServiceDetailsSection service={service} serviceDetails={service_details} deviceName={deviceName} />

      {/* 3. Why Choose Us */}
      <WhyChooseUsSection deviceName={deviceName} />

      {/* 4. Location */}
      <LocationSection location={location} deviceName={deviceName} serviceName={serviceName} />

      {/* 5. FAQ */}
      <FAQSection faqs={faqs} deviceName={deviceName} serviceName={serviceName} />

      {/* 6. Related Repairs + Internal Links */}
      <RelatedRepairsSection
        relatedServices={related_services}
        relatedDevices={related_devices}
        deviceName={deviceName}
        serviceName={serviceName}
      />

      {/* 7. Final CTA */}
      <FinalCTASection deviceName={deviceName} serviceName={serviceName} />
    </div>
  );
}
