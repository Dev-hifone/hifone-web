import { Shield, Users, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { SEO } from '../components/SEO';

const REPAIR_IMAGE = 'https://www.hifone.com.au/assets/frontend/images/we-do-img.jpg';

const values = [
  {
    icon: Shield,
    title: 'Quality First',
    description: 'We use only premium, high-quality parts for every repair.',
  },
  {
    icon: Users,
    title: 'Customer Focused',
    description: 'Your satisfaction is our top priority. We go above and beyond.',
  },
  {
    icon: Target,
    title: 'Expert Precision',
    description: 'Our certified technicians handle every repair with expertise.',
  },
  {
    icon: Heart,
    title: 'Community Trust',
    description: 'Building lasting relationships with our Adelaide community.',
  },
];

export default function AboutPage() {
  return (
    <div data-testid="about-page">
      <SEO 
        title="About HiFone - Phone Repair Experts Adelaide"
        description="HiFone is your one stop phone repair store in Kurralta Park, Adelaide. With 5+ years experience and expert technicians, we provide the best mobile phone repairs with 6 months warranty."
        keywords="about hifone, phone repair adelaide, mobile repair shop, phone technicians adelaide"
      />
      
      {/* Hero */}
      <section className="py-16 lg:py-20 bg-[#111111] relative overflow-hidden">
        <img src={REPAIR_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-overline mb-3">About HiFone</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
                Kurralta Park's Most Trusted Phone Repair Store
              </h1>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Serving Adelaide since 2019 — we've repaired thousands of devices with honest pricing, same-day service, and a 3–6 month warranty on every repair.
              </p>

              {/* Trust stats row */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: '500+', label: 'Happy Customers' },
                  { value: '5.0 ⭐', label: 'Google Rating' },
                  { value: '5+ Yrs', label: 'In Business' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <p className="font-display font-bold text-white text-xl mb-1">{stat.value}</p>
                    <p className="text-white/50 text-xs font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Google review badge */}
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mb-8">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <div>
                  <p className="text-white text-sm font-bold">5.0 on Google</p>
                  <p className="text-white/50 text-xs">Verified customer reviews</p>
                </div>
                <a href="https://g.page/r/CVxRDB1RTAfvEAo" target="_blank" rel="noopener noreferrer"
                  className="text-[#E31E24] text-xs font-bold hover:underline ml-2">Read Reviews →</a>
              </div>

              <div className="flex gap-3">
                <Link to="/book" className="flex items-center gap-2 bg-[#E31E24] hover:bg-[#C01017] text-white rounded-full px-6 h-12 font-bold text-sm transition-colors">
                  Book a Repair
                </Link>
                <Link to="/contact" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full px-6 h-12 font-bold text-sm transition-colors border border-white/20">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={REPAIR_IMAGE}
                alt="HiFone store at Kurralta Park Village"
                className="rounded-3xl w-full h-auto shadow-2xl"
              />
              {/* Overlay badge */}
              <div className="absolute -bottom-4 -left-4 bg-[#E31E24] rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-white text-xs font-semibold opacity-80">Since</p>
                <p className="text-white text-xl font-bold">2019</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-[#777] text-xs font-semibold">Same Day</p>
                <p className="text-[#111] text-xl font-bold">Repairs ✓</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-[#E31E24] uppercase tracking-wider mb-2">
              Our Story
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] tracking-tighter">
              Built on Trust & Excellence
            </h2>
          </div>
          <div className="prose prose-lg mx-auto text-[#555555]">
            <p>
              The Android phones that we deal with include Samsung, Google, Oppo, Huawei and many more. Besides offering comprehensive repair service for every make and model of Android phones, our technicians are equally competent in resolving issues of every version & model of iPhones - from the earliest to the latest versions.
            </p>
            <p>
              We also offer top-notch accessories for mobile phones. The most amazing aspect of our phone repair service in Kurralta Park, Adelaide is that despite the highest quality, we tag a pretty affordable price.
            </p>
            <p>
              Our commitment to customer satisfaction, combined with our "No Fix, No Pay" policy, means you can trust us with your device. Every repair comes with our comprehensive 6-month warranty for complete peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-[#E31E24] uppercase tracking-wider mb-2">
              Our Values
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] tracking-tighter">
              What We Stand For
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-[#E31E24]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[#E31E24]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#111111] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[#555555]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-24 bg-[#1D1D1F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-display text-5xl font-bold text-white mb-2">5000+</p>
              <p className="text-white/60">Repairs Completed</p>
            </div>
            <div>
              <p className="font-display text-5xl font-bold text-white mb-2">5.0</p>
              <p className="text-white/60">Google Rating</p>
            </div>
            <div>
              <p className="font-display text-5xl font-bold text-white mb-2">5+</p>
              <p className="text-white/60">Years Experience</p>
            </div>
            <div>
              <p className="font-display text-5xl font-bold text-white mb-2">6</p>
              <p className="text-white/60">Months Warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-[#111111] mb-4">
            Ready to Experience the HiFone Difference?
          </h2>
          <p className="text-[#555555] mb-8">
            Join thousands of satisfied customers who trust us with their devices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button className="bg-[#E31E24] hover:bg-[#C01017] text-white rounded-full px-8 py-6">
                Book Your Repair Today
              </Button>
            </Link>
            <a href="tel:0432977092">
              <Button variant="outline" className="rounded-full px-8 py-6 border-2">
                Call 0432 977 092
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
