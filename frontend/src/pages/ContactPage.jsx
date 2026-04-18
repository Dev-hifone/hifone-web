import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Car } from 'lucide-react';
import { contactApi, settingsApi } from '../lib/api';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion';

const WHATSAPP = 'https://wa.me/61432977092';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    settingsApi.get().then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await contactApi.submit(formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const phone = settings?.phone || '0432 977 092';
  const email = settings?.email || 'Info.hifone@gmail.com';
  const address = settings?.address || 'Shop 153 Anzac Hwy, Kurralta Park SA 5037';
  const hoursWeekday = settings?.hours_weekday || 'Monday – Saturday: 9am – 6pm';
  const hoursWeekend = settings?.hours_weekend || 'Sunday: Closed';
  const mapsEmbed = settings?.google_maps_embed || '';

  const contactItems = [
    { Icon: MapPin, label: 'Address', value: address },
    { Icon: Phone, label: 'Phone', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    { Icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { Icon: Clock, label: 'Hours', value: `${hoursWeekday} · ${hoursWeekend}` },
    { Icon: Car, label: 'Parking', value: 'Free parking available at the store' },
  ];

  return (
    <div data-testid="contact-page">
      <SEO
        title="Contact HiFone — Phone Repair Kurralta Park"
        description={`Contact HiFone for mobile phone repairs in Kurralta Park, Adelaide. Call ${phone} or visit our store.`}
        keywords="contact hifone, phone repair kurralta park, mobile repair adelaide"
      />

      {/* Header */}
      <section className="py-16 lg:py-24 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-overline mb-3">Reach Us</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Have a question or need a repair? Visit our store or reach out — we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-[#111111] mb-8">
                Contact Information
              </h2>
              <div className="space-y-4 mb-8">
                {contactItems.map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 p-5 bg-[#F8F8F8] rounded-2xl">
                    <div className="w-11 h-11 bg-[#E31E24]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#E31E24]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#111111] text-sm mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-[#E31E24] hover:underline text-sm">{value}</a>
                      ) : (
                        <p className="text-[#555555] text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl px-6 py-3 font-bold text-sm transition-colors mb-8"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp for Instant Reply
              </a>

              {/* Map */}
              {mapsEmbed && (
                <div className="rounded-2xl overflow-hidden border border-gray-200" data-testid="contact-map">
                  <iframe
                    src={mapsEmbed}
                    width="100%" height="280"
                    style={{ border: 0 }} allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="HiFone Store Location"
                  />
                </div>
              )}
            </div>

            {/* Form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-[#111111] mb-8">Quick Enquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-[#111111]">Name *</Label>
                  <Input
                    id="name" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Your name"
                    className="mt-2 rounded-xl border-2 border-gray-200 focus:border-[#E31E24] focus-visible:ring-0 focus-visible:ring-offset-0"
                    data-testid="contact-input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-[#111111]">Email *</Label>
                  <Input
                    id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-2 rounded-xl border-2 border-gray-200 focus:border-[#E31E24] focus-visible:ring-0 focus-visible:ring-offset-0"
                    data-testid="contact-input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-[#111111]">Phone (Optional)</Label>
                  <Input
                    id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange}
                    placeholder="0400 000 000"
                    className="mt-2 rounded-xl border-2 border-gray-200 focus:border-[#E31E24] focus-visible:ring-0 focus-visible:ring-offset-0"
                    data-testid="contact-input-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-semibold text-[#111111]">Message *</Label>
                  <Textarea
                    id="message" name="message" value={formData.message} onChange={handleChange}
                    placeholder="How can we help you?"
                    className="mt-2 rounded-xl border-2 border-gray-200 focus:border-[#E31E24] focus-visible:ring-0 focus-visible:ring-offset-0"
                    rows={5}
                    data-testid="contact-input-message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#E31E24] hover:bg-[#C01017] disabled:opacity-60 text-white rounded-xl py-4 font-bold transition-colors"
                  data-testid="contact-submit"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
