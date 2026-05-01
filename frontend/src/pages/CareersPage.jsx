import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Mail, Phone, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';

const WHATSAPP = 'https://wa.me/61432977092?text=Hi%2C%20I%27m%20interested%20in%20applying%20for%20a%20position%20at%20HiFone.';
const EMAIL = 'Info.hifone@gmail.com';
const PHONE = '0432 977 092';

const POSITIONS = [
  {
    id: 'store-manager',
    title: 'Store Manager',
    type: 'Full Time',
    location: 'Kurralta Park, Adelaide SA 5037',
    badge: 'Now Hiring',
    badgeColor: 'bg-[#E31E24]',
    icon: '🏪',
    description: 'A technology-savvy person with a passion for sales and customer service is required to manage our store at Kurralta Park Village.',
    responsibilities: [
      'Manage day-to-day store operations and staff',
      'Deliver excellent customer service experience',
      'Drive sales and meet monthly targets',
      'Oversee inventory and stock management',
      'Handle customer enquiries, complaints & escalations',
      'Maintain store presentation and cleanliness',
    ],
    requirements: [
      'Strong passion for technology & mobile devices',
      'Proven sales & customer service experience',
      'Excellent communication and people skills',
      'Ability to work in a fast-paced retail environment',
      'Leadership and team management skills',
      'Availability on weekends',
    ],
  },
  {
    id: 'technician',
    title: 'Repair Technician',
    type: 'Full Time',
    location: 'Kurralta Park, Adelaide SA 5037',
    badge: 'Urgently Needed',
    badgeColor: 'bg-[#FF6B00]',
    icon: '🔧',
    description: 'A person with 1–2 years of experience in repairing phones, laptops, and other electronic devices is required immediately.',
    responsibilities: [
      'Diagnose and repair mobile phones, tablets & laptops',
      'Perform screen, battery & charging port replacements',
      'Handle water damage recovery and data retrieval',
      'Provide accurate repair quotes to customers',
      'Maintain repair logs and quality standards',
      'Keep up with new device models and repair techniques',
    ],
    requirements: [
      '1–2 years experience in phone/laptop repair',
      'Hands-on knowledge of iPhone & Samsung repairs',
      'Familiarity with micro-soldering is a plus',
      'Attention to detail and precision',
      'Ability to work efficiently under time pressure',
      'Good communication with customers',
    ],
  },
];

const BENEFITS = [
  { icon: '📈', title: 'Career Growth', desc: 'Learn new skills and grow within the company' },
  { icon: '🤝', title: 'Supportive Team', desc: 'Work with friendly professionals who have your back' },
  { icon: '💰', title: 'Competitive Pay', desc: 'Get rewarded fairly for your hard work' },
  { icon: '⏰', title: 'Work-Life Balance', desc: 'Flexible scheduling and a positive environment' },
];

export default function CareersPage() {
  return (
    <div data-testid="careers-page">
      <SEO
        title="Careers — Join the HiFone Team | Kurralta Park Adelaide"
        description="We're hiring! Join HiFone Repairs in Kurralta Park, Adelaide. Open positions: Store Manager and Repair Technician. Apply now."
      />

      {/* Hero */}
      <section className="py-16 lg:py-20 bg-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #E31E24 0%, transparent 50%), radial-gradient(circle at 80% 50%, #E31E24 0%, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-overline mb-3">We're Hiring</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Join the <span className="text-[#E31E24]">HiFone</span> Team
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              Be part of Adelaide's trusted phone repair team. We're looking for passionate people who love technology and great customer service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why work with us */}
      <section className="py-14 bg-[#F8F8F8] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="font-display font-bold text-[#111111] text-2xl mb-8 text-center">Why Work With Us?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:border-[#E31E24]/30 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{b.icon}</div>
                <p className="font-bold text-[#111111] text-sm mb-1">{b.title}</p>
                <p className="text-[#777777] text-xs leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="font-display font-bold text-[#111111] text-2xl mb-8">Open Positions</h2>
          <div className="space-y-6">
            {POSITIONS.map((pos, i) => (
              <motion.div key={pos.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#F8F8F8] border-2 border-transparent hover:border-[#E31E24]/30 rounded-2xl overflow-hidden transition-all">

                {/* Header */}
                <div className="p-6 pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{pos.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-bold text-[#111111] text-xl">{pos.title}</h3>
                          <span className={`${pos.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                            {pos.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-[#777777] text-xs">
                            <MapPin className="w-3 h-3" /> {pos.location}
                          </span>
                          <span className="flex items-center gap-1 text-[#777777] text-xs">
                            <Clock className="w-3 h-3" /> {pos.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#555555] text-sm leading-relaxed mb-5">{pos.description}</p>
                </div>

                {/* Details grid */}
                <div className="px-6 pb-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-[#111111] text-sm mb-3">Responsibilities:</h4>
                    <ul className="space-y-1.5">
                      {pos.responsibilities.map(r => (
                        <li key={r} className="flex items-start gap-2 text-sm text-[#555555]">
                          <span className="text-[#E31E24] mt-0.5 shrink-0">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111111] text-sm mb-3">What We're Looking For:</h4>
                    <ul className="space-y-1.5">
                      {pos.requirements.map(r => (
                        <li key={r} className="flex items-start gap-2 text-sm text-[#555555]">
                          <span className="text-[#E31E24] mt-0.5 shrink-0">✓</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply buttons */}
                <div className="border-t border-gray-200 px-6 py-4 bg-white flex flex-wrap gap-3">
                  <a href={`https://mail.google.com/mail/?view=cm&to=${EMAIL}&su=Application for ${pos.title} — HiFone`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#E31E24] hover:bg-[#C01017] text-white rounded-xl px-5 py-2.5 text-sm font-bold transition-colors">
                    <Mail className="w-4 h-4" /> Apply via Email
                  </a>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl px-5 py-2.5 text-sm font-bold transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Apply via WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't see right role */}
      <section className="py-14 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display font-bold text-white text-2xl mb-3">Don't See the Right Role?</h2>
          <p className="text-white/60 mb-8">
            We're always looking for great people. Send us your resume and tell us why you'd be a great fit for HiFone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`https://mail.google.com/mail/?view=cm&to=${EMAIL}&su=General Application — HiFone`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-[#C01017] text-white rounded-full px-6 py-3 font-bold transition-colors">
              <Mail className="w-4 h-4" /> {EMAIL}
            </a>
            <a href={`tel:${PHONE.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-3 font-bold transition-colors border border-white/20">
              <Phone className="w-4 h-4" /> {PHONE}
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-6 py-3 font-bold transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>
          <p className="text-white/30 text-sm mt-6">📍 Shop 153 Anzac Hwy, Kurralta Park SA 5037</p>
        </div>
      </section>
    </div>
  );
}
