import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import aus_post_logo from "../../assets/Logo/Australia_post_logo.jpg"
const WHATSAPP = 'https://wa.me/61432977092';

// PRICING TABLE
const PRICING = [
  { service: 'iPhone Screen Repair', price: 'From $89', icon: '📱' },
  { service: 'Samsung Screen Repair', price: 'From $79', icon: '🤖' },
  { service: 'iPhone Battery', price: 'From $59', icon: '🔋' },
  { service: 'Samsung Battery', price: 'From $49', icon: '🔋' },
  { service: 'Laptop Screen', price: 'From $99', icon: '💻' },
  { service: 'Water Damage', price: 'From $79', icon: '💧' },
];

// OFFERS
const OFFERS = [
  {
    emoji: '🎓',
    title: 'Student Discount',
    discount: '10% OFF',
    desc: 'Show your student ID at the counter',
    color: 'border-[#8B5CF6] bg-[#8B5CF6]/5',
    badge: 'bg-[#8B5CF6]',
  },
  {
    emoji: '🌅',
    title: 'Early Bird',
    discount: '10% OFF',
    desc: '9 AM – 12 PM, Monday to Friday',
    color: 'border-[#F59E0B] bg-[#F59E0B]/5',
    badge: 'bg-[#F59E0B]',
  },
  {
    emoji: '📅',
    title: 'Weekend Special',
    discount: '10% OFF',
    desc: 'Laptop & iPad repairs on weekends',
    color: 'border-[#10B981] bg-[#10B981]/5',
    badge: 'bg-[#10B981]',
  },
];

// HOW IT WORKS
const STEPS = [
  { num: '01', icon: '📍', title: 'Drop In or Book', desc: 'Walk in anytime or book online in 30 seconds' },
  { num: '02', icon: '🔧', title: 'We Diagnose & Fix', desc: 'Fast diagnosis, upfront price — no surprises' },
  { num: '03', icon: '✅', title: 'Pick Up Same Day', desc: 'Most repairs done in under 60 minutes' },
];

// QUIZ WIZARD
const DEVICES_QUIZ = ['iPhone', 'Samsung', 'iPad', 'Laptop', 'Other'];
const ISSUES_QUIZ = ['Screen', 'Battery', 'Charging Port', 'Camera', 'Water Damage', 'Other'];

const QuickQuoteWizard = () => {
  const [step, setStep] = useState(1);
  const [device, setDevice] = useState('');
  const [issue, setIssue] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Hi HiFone! I need help.\nDevice: ${device}\nIssue: ${issue}\nName: ${name}\nPhone: ${phone}`);
    window.open(`https://wa.me/61432977092?text=${msg}`, '_blank');
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-display text-xl font-bold text-[#111111] mb-2">Request Sent!</h3>
        <p className="text-[#555555]">We'll WhatsApp you a quote within 15 minutes.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex items-center gap-2 ${s < 3 ? 'flex-1' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-[#E31E24] text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
            {s < 3 && <div className={`flex-1 h-0.5 rounded transition-colors ${step > s ? 'bg-[#E31E24]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="font-semibold text-[#111111] mb-4">Select Your Device</p>
          <div className="grid grid-cols-3 gap-2">
            {DEVICES_QUIZ.map((d) => (
              <button
                key={d}
                onClick={() => { setDevice(d); setStep(2); }}
                className={`py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all ${device === d ? 'border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24]' : 'border-gray-200 text-[#333333] hover:border-[#E31E24]/50'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="font-semibold text-[#111111] mb-4">What's the Issue?</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {ISSUES_QUIZ.map((iss) => (
              <button
                key={iss}
                onClick={() => { setIssue(iss); setStep(3); }}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold text-left transition-all ${issue === iss ? 'border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24]' : 'border-gray-200 text-[#333333] hover:border-[#E31E24]/50'}`}
              >
                {iss}
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-600">← Back</button>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <p className="font-semibold text-[#111111] mb-4">Almost done!</p>
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border-2 border-gray-200 focus:border-[#E31E24] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border-2 border-gray-200 focus:border-[#E31E24] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <p className="text-xs text-gray-400 mb-4">We'll WhatsApp you a quote within 15 minutes</p>
          <button type="submit" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl py-3.5 font-bold text-sm transition-colors">
            Get WhatsApp Quote →
          </button>
          <button type="button" onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-gray-600 mt-3 block">← Back</button>
        </form>
      )}
    </div>
  );
};

export const WhyChooseUs = () => {
  return (
    <>
      {/* OFFERS SECTION */}
      <section className="py-20 bg-[#111111]" data-testid="offers-section">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-overline mb-3">Limited Time</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Special Offers</h2>
            <p className="text-white/50 text-base">Save more on your repair today</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {OFFERS.map((offer, i) => (
              <motion.div
                key={offer.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`border-2 rounded-2xl p-6 ${offer.color}`}
              >
                <div className="text-3xl mb-3">{offer.emoji}</div>
                <div className={`inline-block ${offer.badge} text-white text-xs font-black px-3 py-1 rounded-full mb-3`}>
                  {offer.discount}
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-1">{offer.title}</h3>
                <p className="text-white/60 text-sm">{offer.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-overline mb-3">Simple Process</p>
            <h2 className="text-h2 mb-4">How It Works</h2>
            <p className="text-body-large max-w-lg mx-auto">Book online in 30 seconds. Fixed same day.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            {/* <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#E31E24] to-[#E31E24] opacity-20" /> */}
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-[#E31E24]/10 rounded-full mb-5 text-4xl">
                  {step.icon}
                  <span className="absolute -top-1 -right-1 w-7 h-7 bg-[#E31E24] rounded-full text-white text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-bold text-[#111111] text-xl mb-2">{step.title}</h3>
                <p className="text-[#777777] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + QUICK QUOTE */}
      <section className="py-20 bg-[#F8F8F8]" data-testid="pricing-section">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Pricing table */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-overline mb-3">Transparent Pricing</p>
              <h2 className="text-h2 mb-3">Repair Prices</h2>
              <p className="text-[#555555] mb-6 text-sm">Final price confirmed before we start — no surprises</p>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                {PRICING.map((item, i) => (
                  <div key={item.service} className={`flex items-center justify-between px-6 py-4 ${i !== PRICING.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{i + 1}.</span>
                      <span className="font-medium text-[#111111] text-sm">{item.service}</span>
                    </div>
                    <span className="font-bold text-[#E31E24] text-sm">{item.price}</span>
                  </div>
                ))}
              </div>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl px-6 py-3 font-bold text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Get Exact Quote on WhatsApp
              </a>
            </motion.div>

            {/* Quick Quote Wizard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
            >
              <p className="text-overline mb-2">Free Quote</p>
              <h3 className="font-display font-bold text-[#111111] text-2xl mb-6">Book a Repair</h3>
              <QuickQuoteWizard />
            </motion.div>
          </div>
        </div>
      </section>


      {/* WHATSAPP PHOTO CTA */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* WhatsApp Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-8"
            >
              <div className="text-4xl mb-4">📸</div>
              <h3 className="font-display font-bold text-white text-xl mb-2">
                Not sure what's wrong?
              </h3>
              <p className="text-white/60 text-sm mb-5">
                Send us a photo on WhatsApp — we'll diagnose and send a quote within 15 minutes.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl px-6 py-3 font-bold text-sm transition-colors"
              >
                Send a Photo Now →
              </a>
            </motion.div>

            {/* Free Parking + Kmart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/15 rounded-2xl p-8"
            >
              <div className="text-4xl mb-4">🅿️</div>
              <h3 className="font-display font-bold text-white text-xl mb-2">
                Easy to Find & Park
              </h3>
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3">
                  <span className="text-[#E31E24] text-lg">✓</span>
                  <p className="text-white/70 text-sm"><span className="text-white font-semibold">Free parking</span> available right at our store — no stress, no meters.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#E31E24] text-lg">✓</span>
                  <p className="text-white/70 text-sm"><span className="text-white font-semibold">Kmart is 1 minute walk</span> — drop your phone with us, shop while we fix it!</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#E31E24] text-lg">✓</span>
                  <p className="text-white/70 text-sm">Located at <span className="text-white font-semibold">153 Anzac Hwy, Kurralta Park</span> — easy access from Anzac Highway.</p>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Kurralta+Park+Centre+Adelaide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-6 py-3 font-bold text-sm transition-colors"
              >
                📍 Get Directions →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AUSTRALIA POST MAIL-IN — Dedicated Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=700&q=80"
                alt="Mail-in phone repair Australia Post"
                className="w-full rounded-2xl object-cover aspect-[4/3]"
              />
              {/* Australia Post badge overlay */}
              <div className="absolute bottom-4 left-4 bg-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
                {/* <div className="w-10 h-10 bg-[#E31E24] rounded-xl flex items-center justify-center text-white font-black text-xs text-center leading-tight">
                  AUS<br/>POST */}
                <img src={aus_post_logo} className='w-10 h-10 bg-[#E31E24] rounded-xl flex items-center justify-center text-white font-black text-xs text-center leading-tight' />
                {/* </div> */}
                <div>
                  <p className="font-bold text-[#111111] text-sm">Powered by</p>
                  <p className="text-[#E31E24] font-black text-sm">Australia Post</p>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-overline mb-3">Can't Visit Us?</p>
              <h2 className="text-h2 mb-4">
                Mail Your Device to Us
              </h2>
              <p className="text-[#555555] text-lg leading-relaxed mb-6">
                Can't make it to Kurralta Park? No worries — simply send your device via <strong>Australia Post</strong> and we'll repair it and ship it straight back to you, anywhere in Australia.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'Pack your device securely and post to our address',
                  'We repair and test it — usually within 1–2 business days',
                  'We ship it back via tracked Australia Post',
                  'Pay securely online before we send it back',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-[#E31E24] rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-[#444444] text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#F8F8F8] rounded-2xl p-5 mb-6 border-l-4 border-[#E31E24]">
                <p className="text-[#333333] text-sm font-semibold">📦 Our Postal Address:</p>
                <p className="text-[#555555] text-sm mt-1">HiFone Repairs, Shop 153 Anzac Hwy,<br />Kurralta Park SA 5037</p>
              </div>
              <Link
                to="/mail-in"
                className="inline-flex items-center gap-2 bg-[#E31E24] hover:bg-[#C01017] text-white rounded-xl px-6 py-3 font-bold text-sm transition-colors"
              >
                Start Mail-in Repair →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;
