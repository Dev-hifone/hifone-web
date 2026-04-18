import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Battery, Droplets, PlugZap, Camera, Volume2 } from 'lucide-react';
import { serviceApi } from '../lib/api';
import { SEO } from '../components/SEO';

const iconMap = {
  'Smartphone': Smartphone,
  'Battery': Battery,
  'Droplets': Droplets,
  'PlugZap': PlugZap,
  'Camera': Camera,
  'Volume2': Volume2,
};

const WHATSAPP = 'https://wa.me/61432977092';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceApi.getAll()
      .then(res => setServices(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="services-page">
      <SEO
        title="Phone Repair Services in Adelaide | HiFone"
        description="HiFone offers comprehensive phone repair services in Kurralta Park, Adelaide. Screen repair, battery replacement, water damage recovery. Same day service with warranty."
        keywords="phone repair services adelaide, screen repair, battery replacement, water damage repair, charging port repair, iphone repair, samsung repair"
      />

      {/* Hero */}
      <section className="py-16 lg:py-24 bg-[#111111]">
        <div className="h-1 w-full bg-[#E31E24] absolute top-16 left-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-overline mb-3">What We Do</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Our Repair Services
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Professional repairs for all major smartphone and tablet brands. Fast turnaround with warranty you can trust.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-[#F8F8F8] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => {
                const IconComponent = iconMap[service.icon] || Smartphone;
                return (
                  <div
                    key={service.id}
                    className="bg-[#F8F8F8] border-2 border-transparent hover:border-[#E31E24] rounded-2xl p-8 transition-all duration-300 group"
                    data-testid={`service-detail-${service.slug}`}
                  >
                    <div className="w-14 h-14 bg-[#E31E24]/10 group-hover:bg-[#E31E24] rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
                      <IconComponent className="w-7 h-7 text-[#E31E24] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-[#111111] mb-3">
                      {service.name}
                    </h2>
                    <p className="text-[#555555] leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <Link
                      to="/book"
                      className="inline-flex items-center gap-2 bg-[#E31E24] hover:bg-[#C01017] text-white rounded-full px-6 py-3 text-sm font-bold transition-colors"
                    >
                      Book This Repair
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* What We Repair */}
      <section className="py-16 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-[#111111] text-center mb-8">
            What We Repair
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            {['Water Damaged','Broken Screen','Cracked Back Glass','Draining Battery',
              'Faulty Charging Port','Software Problem','Data Backup','Unlocking',
              'Unresponsive Speaker','Microphone Issue','Damaged Power Button','Broken Home Button',
              'Faulty Motherboard','Touch Issue','Housing Repair','Camera Problem'].map((issue) => (
              <div key={issue} className="bg-white border border-gray-100 rounded-xl p-3 text-sm text-[#333333] font-medium hover:border-[#E31E24] hover:text-[#E31E24] transition-colors cursor-default">
                {issue}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#E31E24]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Not Sure What's Wrong?
          </h2>
          <p className="text-white/80 mb-8">
            Bring your device in for a free diagnosis. We'll identify the issue and quote you upfront. No fix, no pay!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#E31E24] hover:bg-gray-100 rounded-full px-8 py-3.5 font-bold transition-colors"
            >
              Book a Repair
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#111111]/30 hover:bg-[#111111]/40 text-white border-2 border-white/30 rounded-full px-8 py-3.5 font-bold transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
