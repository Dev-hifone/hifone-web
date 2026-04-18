import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import LOGO_URL from "../../assets/Logo/hifone_logo.png"

const WHATSAPP = 'https://wa.me/61432977092';

const footerLinks = {
  services: [
    { name: 'Screen Repair', href: '/services/screen-repair' },
    { name: 'Battery Replacement', href: '/services/battery-replacement' },
    { name: 'Water Damage', href: '/services/water-damage-repair' },
    { name: 'Charging Port', href: '/services/charging-port-repair' },
    { name: 'Laptop Repair', href: '/services' },
    { name: 'MacBook Repair', href: '/services' },
  ],
  devices: [
    { name: 'iPhone Repair', href: '/devices/apple' },
    { name: 'Samsung Repair', href: '/devices/samsung' },
    { name: 'iPad Repair', href: '/devices/ipad' },
    { name: 'Pixel Repair', href: '/devices/google' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Book Repair', href: '/book' },
    { name: 'Blog', href: '/blog' },
  ],
};

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#111111] text-white" data-testid="footer">
      {/* Red accent top */}
      <div className="h-1 bg-[#E31E24]" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img src={LOGO_URL} alt="HiFone" className="h-10 w-auto" />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
              Kurralta Park's fastest repair shop. iPhone, Samsung, iPad, Laptop & MacBook repairs with a warranty you can trust.
            </p>
            <div className="space-y-3">
              <a href="tel:0432977092" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#E31E24]" />0432 977 092
              </a>
              <a href="mailto:Info.hifone@gmail.com" className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#E31E24]" />info@hifone.com.au
              </a>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-[#E31E24] shrink-0" />Shop 153 Anzac Hwy, Kurralta Park SA 5037
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <Clock className="w-4 h-4 text-[#E31E24] shrink-0" />Mon–Sat: 9am–6pm
              </div>
            </div>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-5 py-2.5 text-sm font-bold transition-colors"
            >
              WhatsApp Us
            </a>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#E31E24] mb-5">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map(l => (
                <li key={l.name}>
                  <Link to={l.href} className="text-sm text-white/50 hover:text-white transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#E31E24] mb-5">Devices</h3>
            <ul className="space-y-3">
              {footerLinks.devices.map(l => (
                <li key={l.name}>
                  <Link to={l.href} className="text-sm text-white/50 hover:text-white transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#E31E24] mb-5">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map(l => (
                <li key={l.name}>
                  <Link to={l.href} className="text-sm text-white/50 hover:text-white transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">© {year} HiFone Repairs. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="text-xs text-white/30 hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-white/30 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
