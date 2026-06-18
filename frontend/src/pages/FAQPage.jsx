import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { SEO } from '../components/SEO';

const FAQ_SECTIONS = [
  {
    category: 'General Repairs',
    emoji: '🔧',
    faqs: [
      { q: 'Where can I get my phone repaired in Adelaide?', a: 'Hi Fone in Kurralta Park on Anzac Highway provides professional phone, tablet, laptop, and device repair services with fast turnaround times.' },
      { q: 'Where can I find phone repair services near me in Adelaide?', a: 'If you\'re searching for "phone repair near me" in Adelaide, Hi Fone Kurralta Park offers convenient walk-in repairs for most major device brands along with free parking.' },
      { q: 'What devices do you repair?', a: 'We repair smartphones, iPhones, Samsung devices, Google Pixels, tablets, iPads, laptops, MacBooks, gaming consoles, smartwatches, and other electronic devices.' },
      { q: 'Do you repair all phone brands?', a: 'Yes. We repair most major brands including Apple, Samsung, Google Pixel, Oppo, Huawei, Xiaomi, Motorola, Nokia, and more.' },
      { q: 'Do you repair iPhones in Adelaide?', a: 'Yes. We provide iPhone screen, battery, charging port, camera, speaker, and water damage repairs.' },
      { q: 'Do you repair Samsung phones in Adelaide?', a: 'Yes. We repair Samsung Galaxy phones, including screen replacements, battery replacements, charging issues, and software faults.' },
      { q: 'Do you repair Google Pixel phones?', a: 'Yes. We repair Google Pixel devices, including screens, batteries, charging ports, and cameras.' },
      { q: 'Do you repair Oppo, Huawei and Xiaomi phones?', a: 'Yes. Our technicians repair a wide range of Android devices including Oppo, Huawei, Xiaomi, Vivo, and Realme phones.' },
      { q: 'Do you repair iPads and tablets?', a: 'Yes. We repair iPads and most tablet brands for screen, battery, charging, and software issues.' },
      { q: 'Do you repair laptops and MacBooks?', a: 'Yes. We offer laptop and MacBook repairs including screen replacements, battery repairs, charging issues, and performance upgrades.' },
      { q: 'Do you repair gaming consoles and smartwatches?', a: 'Yes. We repair many gaming consoles and smartwatches depending on the model and fault.' },
      { q: 'Do I need an appointment for a repair?', a: 'Walk-ins are welcome during business hours. You can also make a booking on our website.' },
      { q: 'Can I walk in without a booking?', a: 'Yes. Most repairs can be assessed and booked on the spot.' },
      { q: 'Do you offer same-day phone repairs in Adelaide?', a: 'Yes. Most repairs can be completed on the same day, subject to parts availability.' },
      { q: 'What Adelaide suburbs & Regional areas do you service?', a: 'We serve customers from entire South Australia. If you are in a Regional Area, you may not visit us — call us to discuss your problem and send your device through Australia Post. We shall despatch it back to you within 48 hours after repair.' },
    ]
  },
  {
    category: 'Screen Repairs',
    emoji: '📱',
    faqs: [
      { q: 'Can you fix a cracked phone screen?', a: 'Yes. We replace cracked and damaged screens of almost all phone brands and their models.' },
      { q: 'How long does a phone screen replacement take?', a: 'Most screen replacements are completed within 30 minutes to a few hours.' },
      { q: 'Can a smashed phone screen be repaired?', a: 'Yes. Even severely damaged screens can often be replaced successfully.' },
      { q: 'Can you replace an iPhone screen the same day?', a: 'Yes. Most iPhone screen repairs are completed on the same day.' },
      { q: 'Can you replace a Samsung screen the same day?', a: 'Many Samsung screen replacements can be completed the same day, depending on stock availability.' },
      { q: 'How much does a phone screen replacement cost?', a: 'Pricing varies by device model. Contact us for a free quote.' },
      { q: 'Can you replace just the glass on my screen?', a: 'For some models, glass-only replacement is possible. Our technicians can assess your device.' },
      { q: 'Is it worth repairing a cracked phone screen?', a: 'In most cases, repairing the screen is significantly cheaper than replacing the device.' },
      { q: 'Will my touchscreen work normally after screen replacement?', a: 'Yes. A properly installed replacement screen should restore normal touch functionality.' },
      { q: 'Do you use original-quality screens?', a: 'We use high-quality replacement parts designed to meet or exceed industry standards and to match your budget.' },
      { q: 'Can you repair phones with black screens?', a: 'Yes. Black screens are often caused by display damage and can usually be repaired.' },
      { q: 'Can you repair phones with flickering screens?', a: 'Yes. Flickering screens are commonly repairable through screen or internal component replacement.' },
      { q: 'Can you repair phones with dead pixels?', a: 'Yes. Dead pixel issues are typically resolved by replacing the display.' },
      { q: 'Can you fix phones with display lines on the screen?', a: 'Yes. Display lines usually indicate screen damage that can be repaired with a replacement display.' },
      { q: 'Can you repair screen damage caused by drops?', a: 'Yes. We regularly repair phones damaged from accidental drops and impacts.' },
    ]
  },
  {
    category: 'Battery Repairs',
    emoji: '🔋',
    faqs: [
      { q: 'Can my phone battery be replaced?', a: 'Yes. Most phone batteries can be replaced quickly and professionally.' },
      { q: 'How long does a battery replacement take?', a: 'Most battery replacements take between 30 minutes and 2 hours.' },
      { q: 'How much does phone battery replacement cost?', a: 'Pricing depends on the device model. Contact us for an accurate quote.' },
      { q: 'How do I know if my battery needs replacement?', a: 'Common signs include rapid battery drain, overheating, swelling, or unexpected shutdowns.' },
      { q: 'Why is my phone battery draining quickly?', a: 'Battery degradation, background apps, software issues, or charging problems can cause excessive battery drain.' },
      { q: 'Why does my phone switch off unexpectedly?', a: 'This often indicates a failing battery or power management issue.' },
      { q: 'Is a swollen phone battery dangerous?', a: 'Yes. A swollen battery can be a safety risk and should be replaced immediately.' },
      { q: 'Can battery replacement improve phone performance?', a: 'Yes. A new battery can improve stability, battery life, and overall performance.' },
      { q: 'Can you replace iPhone batteries?', a: 'Yes. We provide professional iPhone battery replacement services.' },
      { q: 'Can you replace Samsung phone batteries?', a: 'Yes. We replace batteries in most Samsung Galaxy devices.' },
      { q: 'Will a new battery make my phone last longer?', a: 'Yes. A replacement battery can significantly improve battery life.' },
      { q: 'Do replacement batteries come with a warranty?', a: 'Yes. Our battery replacements are covered by warranty.' },
    ]
  },
  {
    category: 'Charging Problems',
    emoji: '⚡',
    faqs: [
      { q: 'Why is my phone charging slowly?', a: 'Slow charging may be caused by a faulty cable, charger, battery, charging port, or software issue.' },
      { q: 'Can a slow-charging phone be repaired?', a: 'Yes. We can diagnose and repair the cause of slow charging.' },
      { q: 'Can you repair charging ports?', a: 'Yes. Charging port repairs and replacements are among our most common services.' },
      { q: 'How long does charging port repair take?', a: 'Most charging port repairs can be completed within a few hours.' },
      { q: 'How much does charging port repair cost?', a: 'Costs vary depending on the device model and repair complexity.' },
      { q: "Why won't my phone charge?", a: 'The problem may be caused by the battery, charging port, charger, motherboard, or software fault.' },
      { q: 'Can dirt in the charging port stop charging?', a: 'Yes. Dust and debris can prevent proper charging and may require professional cleaning.' },
      { q: 'Can wireless charging issues be repaired?', a: 'Yes. We can diagnose and repair many wireless charging faults.' },
    ]
  },
  {
    category: 'Water Damage',
    emoji: '💧',
    faqs: [
      { q: 'Can a water-damaged phone be repaired?', a: 'Yes. Many water-damaged devices can be successfully repaired if treated quickly.' },
      { q: 'What should I do if my phone falls into water?', a: 'Turn it off immediately, avoid charging it, and bring it to us as soon as possible.' },
      { q: 'How quickly should I bring in a water-damaged phone?', a: 'As soon as possible. Fast action greatly improves repair success rates.' },
      { q: 'Can a phone survive water damage?', a: 'Yes. Many devices can be recovered with professional treatment.' },
      { q: 'Can data be recovered from a water-damaged phone?', a: 'In many cases, yes. Data recovery is often possible even when the device is not fully repairable.' },
      { q: 'How long does water damage repair take?', a: 'Assessment is usually completed quickly, with repair times depending on the severity of the damage.' },
      { q: 'How much does water damage repair cost?', a: 'Costs vary based on the extent of the damage and required repairs.' },
      { q: 'Should I put my wet phone in rice?', a: 'No. Rice is generally ineffective and may delay proper treatment. Bring it to us immediately.' },
      { q: 'Can salt water damage be repaired?', a: 'Yes, although salt water causes severe corrosion and should be treated urgently. We specialise in salt water damage repair.' },
      { q: 'Can water-damaged iPhones be repaired?', a: 'Yes. We regularly repair water-damaged iPhones.' },
    ]
  },
  {
    category: 'Camera, Speaker & Audio',
    emoji: '📷',
    faqs: [
      { q: 'Can you repair phone camera issues?', a: 'Yes. We repair front and rear camera faults.' },
      { q: 'Why is my phone camera blurry?', a: 'Blurred photos may be caused by lens damage, focus issues, or camera hardware faults.' },
      { q: 'Can you replace a broken camera lens?', a: 'Yes. Camera lens replacement is available for many models.' },
      { q: 'How long does camera repair take?', a: 'Most camera repairs are completed within the same day or next business day.' },
      { q: 'Can you repair front camera issues?', a: 'Yes.' },
      { q: 'Can you repair rear camera issues?', a: 'Yes.' },
      { q: 'Can you repair phone speaker problems?', a: 'Yes. We repair speaker, earpiece, and audio faults.' },
      { q: "Why can't I hear calls properly?", a: 'The earpiece speaker may be blocked, damaged, or malfunctioning.' },
      { q: "Why can't people hear me during calls?", a: 'Your microphone may require cleaning, repair, or replacement.' },
      { q: 'Can you repair microphones?', a: 'Yes.' },
      { q: 'How long does speaker repair take?', a: 'Most speaker repairs are completed within a few hours.' },
      { q: 'How much does speaker repair cost?', a: 'Pricing depends on the device model and fault.' },
    ]
  },
  {
    category: 'Software & Malware',
    emoji: '💻',
    faqs: [
      { q: 'Why is my phone running slowly?', a: 'Storage limitations, outdated software, failing batteries, or background apps can affect performance.' },
      { q: 'Can a slow phone be fixed?', a: 'Yes. We can diagnose and optimise device performance.' },
      { q: 'Can you remove malware from my phone?', a: 'Yes. We can remove malicious software and security threats.' },
      { q: 'Can you remove viruses from my phone?', a: 'Yes. We provide virus and malware removal services.' },
      { q: 'Can you fix software issues?', a: 'Yes. We diagnose and resolve a wide range of software problems.' },
      { q: 'Can you fix phones stuck on the startup logo?', a: 'Yes.' },
      { q: "Can you repair phones that won't turn on?", a: 'Yes. We can diagnose both hardware and software causes.' },
      { q: 'Can you update my phone software?', a: 'Yes.' },
      { q: 'Can you help if my phone memory is full?', a: 'Yes. We can optimise storage and recommend solutions.' },
      { q: 'Can you transfer data to a new device?', a: 'Yes. We provide data transfer services.' },
    ]
  },
  {
    category: 'Back Glass Repairs',
    emoji: '🔲',
    faqs: [
      { q: 'Can you repair a broken phone back glass?', a: 'Yes. We repair and replace cracked, shattered, or damaged back glass on many smartphone models, including iPhones and Samsung devices.' },
      { q: 'Can you repair a cracked iPhone, Samsung, Google, Oppo and other phones back glass in Adelaide?', a: 'Yes. Hi Fone provides professional back glass repair services for most phone models.' },
    ]
  },
  {
    category: 'Data Recovery',
    emoji: '💾',
    faqs: [
      { q: 'Can you recover data from a broken phone?', a: 'Yes. We can often recover photos, videos, contacts, messages, and other important files from damaged phones.' },
      { q: 'Can you recover photos from a smashed phone?', a: 'Yes. Even if the screen is completely broken, we may still be able to access and recover your photos and videos.' },
      { q: 'Can you recover contacts from a damaged phone?', a: 'Yes. Contacts, call logs, messages, calendars, and other personal information can often be recovered.' },
      { q: 'Can data be recovered from a water-damaged phone?', a: 'In many cases, yes. The sooner the device is brought in, the greater the chances of successful data recovery.' },
      { q: "Can you recover data from a phone that won't turn on?", a: 'Yes. Many devices that appear dead can still have their data recovered using specialised tools and techniques.' },
      { q: 'Can you recover data from an iPhone?', a: 'Yes. We offer data recovery services for most iPhone models, depending on the nature of the fault.' },
      { q: 'Can you recover data from a Samsung phone?', a: 'Yes. We can recover data from Samsung Galaxy devices affected by hardware or software issues.' },
      { q: 'Can you recover deleted photos and videos?', a: 'In some cases, deleted files may be recoverable if they have not been permanently overwritten.' },
      { q: 'Can you recover WhatsApp messages and chats?', a: 'Depending on the device condition and available backups, WhatsApp data recovery may be possible.' },
      { q: 'Can you recover data from a phone with a broken screen?', a: 'Yes. A damaged screen does not necessarily mean your data is lost.' },
      { q: 'Can you recover data from a locked phone?', a: "Recovery options depend on the device's security settings and ownership verification requirements." },
      { q: 'How much does phone data recovery cost?', a: 'Costs vary depending on the device model, damage level, and complexity of the recovery process. We can provide an assessment and quote.' },
      { q: 'How long does data recovery take?', a: 'Recovery can take anywhere from a few hours to several days, depending on the condition of the device.' },
      { q: 'Can you transfer recovered data to a new phone?', a: 'Yes. We can transfer recovered data directly to your replacement phone, tablet, laptop, USB drive, or external storage device.' },
      { q: 'Is my data safe during data recovery?', a: 'Absolutely. Customer privacy and confidentiality are a top priority. All recovered data is handled securely.' },
      { q: 'What type of data can be recovered?', a: 'We may be able to recover: Photos and Videos, Contacts, SMS Messages, WhatsApp Data, Documents and Files, Notes and Calendars, Call Logs, Emails, and App Data.' },
      { q: 'Can you recover data from tablets and iPads?', a: 'Yes. We offer data recovery services for iPads, tablets, and many other digital devices.' },
      { q: 'Do you provide emergency data recovery services?', a: 'Yes. Priority and urgent data recovery services may be available for customers who need important data recovered quickly.' },
      { q: 'What should I do if I need data recovery?', a: 'Stop using the device immediately and bring it to Hi Fone as soon as possible. Continued use can reduce the chances of successful recovery.' },
    ]
  },
  {
    category: 'Warranty, Privacy & Process',
    emoji: '🛡️',
    faqs: [
      { q: 'Do repairs come with a warranty?', a: 'Yes. Most repairs are covered by our repair warranty of six months.' },
      { q: 'What does the repair warranty cover?', a: 'The warranty covers defects related to the replaced parts and workmanship.' },
      { q: 'Do you use genuine or premium-quality parts?', a: 'We use original and aftermarket parts to match your budget.' },
      { q: 'Are replacement parts as good as the originals?', a: 'Our quality parts are selected for reliability, performance, and durability and are covered by a six-month warranty.' },
      { q: 'Is my personal data safe during repair?', a: 'Yes. Customer privacy and confidentiality are strictly maintained.' },
      { q: 'Do I need to provide my passcode for repair?', a: 'Only if necessary for testing device functionality after repair.' },
    ]
  },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className="border border-[#EEEEEE] rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FFF5F5] transition-colors group"
      >
        <span className="text-sm font-semibold text-[#111111] pr-4 leading-snug group-hover:text-[#E31E24] transition-colors">
          {q}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-[#E31E24] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 pt-1 text-sm text-[#555555] leading-relaxed border-t border-[#F0F0F0]">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = FAQ_SECTIONS.map(section => ({
    ...section,
    faqs: section.faqs.filter(
      f =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(s =>
    (activeCategory === 'All' || s.category === activeCategory) && s.faqs.length > 0
  );

  const totalResults = filtered.reduce((acc, s) => acc + s.faqs.length, 0);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Frequently Asked Questions | HiFone Repairs Adelaide"
        description="Got questions about phone, tablet, laptop or data recovery repairs in Adelaide? Find answers to all your repair questions at HiFone Kurralta Park."
      />

      {/* Hero */}
      <section className="bg-[#111111] pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#E31E24]/20 text-[#E31E24] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
              Help Centre
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-display mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-white/60 text-base mb-8 leading-relaxed">
              Hi Fone Kurralta Park on Anzac Highway — experienced technicians, fast turnaround,
              quality parts, competitive pricing, same-day repairs, and free parking.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="text"
                placeholder="Search questions…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border-2 border-transparent focus:border-[#E31E24] outline-none text-sm text-[#111111] transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category pills */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#EEEEEE] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {['All', ...FAQ_SECTIONS.map(s => s.category)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#E31E24] text-white'
                  : 'bg-[#F4F4F4] text-[#555555] hover:bg-[#EEEEEE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {search && (
          <p className="text-sm text-[#888888] mb-6">
            {totalResults} result{totalResults !== 1 ? 's' : ''} for "<strong className="text-[#111111]">{search}</strong>"
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-[#555555]">No results found. Try a different search term.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filtered.map(section => (
              <div key={section.category}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xl">{section.emoji}</span>
                  <h2 className="text-lg font-bold text-[#111111] font-display">{section.category}</h2>
                  <span className="text-xs text-[#AAAAAA] ml-auto">{section.faqs.length} questions</span>
                </div>
                <div className="space-y-2">
                  {section.faqs.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-[#111111] rounded-3xl p-8 text-center">
          <p className="text-white font-bold text-lg mb-2">Still have a question?</p>
          <p className="text-white/60 text-sm mb-6">Our team is happy to help — walk in or reach out anytime.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/61432977092"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              WhatsApp Us
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-[#c91920] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}