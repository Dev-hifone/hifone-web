import { motion } from 'framer-motion';
import { Package, Clock, Shield, MapPin, Truck } from 'lucide-react';
import { SEO } from '../components/SEO';
import MailInForm from '@/components/home/MailInForm';
import aus_post_logo from "../assets/Logo/Australia_post_logo.jpg"

const POSTAL_ADDRESS = 'HiFone Repairs, Shop 153 Anzac Hwy, Kurralta Park SA 5037';

const HOW_IT_WORKS = [
  {
    n: '1',
    icon: Package,
    title: 'Fill the form below',
    desc: "Tell us your device, issue, and return address. We'll confirm receipt by email.",
  },
  {
    n: '2',
    icon: MapPin,
    title: 'Pack & post your device',
    desc: 'Wrap securely in bubble wrap, box it up, and post via Australia Post to our Kurralta Park address.',
  },
  {
    n: '3',
    icon: Clock,
    title: 'We repair within 48 hrs',
    desc: "Once we receive it, we diagnose and repair. We'll contact you with a quote before touching anything.",
  },
  {
    n: '4',
    icon: Truck,
    title: 'Shipped back to you',
    desc: 'Your repaired device ships back via tracked Australia Post. Pay securely online before dispatch.',
  },
];

const TRUST_ITEMS = [
  { icon: Shield, text: '3–6 Month Warranty' },
  { icon: Clock, text: '48hr Turnaround' },
  { icon: Package, text: 'Tracked Return Shipping' },
];

// Australia Post logo as inline SVG (red + white wordmark style)
function AustPostLogo() {
  return (
    <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
                      <img src={aus_post_logo} className='w-10 h-10 bg-[#E31E24] rounded-xl flex items-center justify-center text-white font-black text-xs text-center leading-tight' />

      <div>
        <p className="text-[10px] font-semibold text-gray-400 leading-none">Powered by</p>
        <p className="text-xs font-bold text-[#E31E24] leading-none mt-0.5">Australia Post</p>
      </div>
    </div>
  );
}

export default function MailInPage() {
  return (
    <>
      <SEO
        title="Mail-in Device Repair — HiFone Repairs"
        description="Can't visit us? Mail your phone, tablet or laptop to HiFone Repairs in Kurralta Park. We repair and ship back anywhere in Australia within 48 hours."
      />

      {/* ── Hero ── */}
      <section className="bg-[#111111] pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block text-[#E31E24] text-xs font-bold uppercase tracking-widest mb-4">
              Can't Visit Us?
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Mail Your Device.<br />
              <span className="text-[#E31E24]">We Fix & Ship Back.</span>
            </h1>
            <p className="text-gray-400 text-base max-w-xl mx-auto mb-6 leading-relaxed">
              Anywhere in Australia — simply post your device to us via Australia Post.
              We repair it and ship it straight back within 48 hours.
            </p>

            {/* Trust strip */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Icon className="h-4 w-4 text-[#E31E24]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <AustPostLogo />
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gray-50 border-b border-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ n, icon: Icon, title, desc }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="relative bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-7 w-7 rounded-full bg-[#E31E24] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {n}
                  </span>
                  <Icon className="h-4 w-4 text-gray-400" />
                </div>
                <p className="font-semibold text-sm text-gray-900 mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content: form + address sidebar ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Form — takes 2/3 */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Start your mail-in repair</h2>
              <MailInForm />
            </div>

            {/* Sidebar — 1/3 */}
            <div className="space-y-4">

              {/* Postal address card */}
              <div className="rounded-xl border-l-4 border-[#E31E24] bg-gray-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                  Our Postal Address
                </p>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                  HiFone Repairs<br />
                  Shop 153 Anzac Hwy<br />
                  Kurralta Park SA 5037
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(POSTAL_ADDRESS).then(() => alert('Address copied!'))}
                  className="mt-3 text-xs text-[#E31E24] font-semibold hover:underline"
                >
                  Copy address
                </button>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/61432977092"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] transition-colors p-4 text-white"
              >
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div>
                  <p className="text-xs font-semibold opacity-80">Questions? Chat with us</p>
                  <p className="text-sm font-bold">WhatsApp 0432 977 092</p>
                </div>
              </a>

              {/* Packing tips */}
              <div className="rounded-xl border border-gray-100 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Packing Tips</p>
                <ul className="space-y-2">
                  {[
                    'Wrap device in bubble wrap',
                    'Place in a sturdy cardboard box',
                    'Include your name & phone inside',
                    'Use Australia Post tracked service',
                    'WhatsApp us your tracking number',
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="mt-0.5 h-3 w-3 rounded-full bg-[#E31E24]/10 border border-[#E31E24]/30 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}