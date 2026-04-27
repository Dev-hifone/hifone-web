import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useBrandsData } from '../../hooks/useBrandsData';
import LOGO_URL from "../../assets/Logo/hifone_logo.png"

const PHONE_NUMBER = '0432 977 092';
const WHATSAPP = 'https://wa.me/61432977092';

const SERVICES_LIST = [
  { label: 'Screen Repair',       href: '/services?type=screen-repair',       icon: '📱', desc: 'Cracked or broken display' },
  { label: 'Battery Replacement', href: '/services?type=battery-replacement',  icon: '🔋', desc: 'Draining fast or won\'t charge' },
  { label: 'Water Damage',        href: '/services?type=water-damage-repair',  icon: '💧', desc: 'Liquid damage recovery' },
  { label: 'Charging Port',       href: '/services?type=charging-port-repair', icon: '⚡', desc: 'Not charging or loose port' },
  { label: 'Camera Repair',       href: '/services?type=camera-repair',        icon: '📷', desc: 'Blurry or broken camera' },
  { label: 'Speaker & Mic',       href: '/services?type=speaker-mic-repair',   icon: '🔊', desc: 'No sound or mic issues' },
  { label: 'Back Glass',          href: '/services?type=back-glass',           icon: '🔲', desc: 'Shattered back panel' },
  { label: 'Data Recovery',       href: '/services?type=data-recovery',        icon: '💾', desc: 'Recover lost files & photos' },
];

// Repair Mega Menu
const RepairMega = ({ brands, onClose }) => {
  const navigate = useNavigate();

  // Group brands by category
  const phones  = brands.filter(b => b.category === 'phones');
  const tablets = brands.filter(b => b.category === 'tablets');
  const laptops = brands.filter(b => b.category === 'laptops');
  const watches = brands.filter(b => b.category === 'watches');

  const groups = [
    { label: '📱 Phones', brands: phones,  category: 'phones' },
    { label: '📋 Tablets', brands: tablets, category: 'tablets' },
    { label: '💻 Laptops', brands: laptops, category: 'laptops' },
    { label: '⌚ Watches', brands: watches, category: 'watches' },
  ].filter(g => g.brands.length > 0);

  return (
    <div className="bg-white border-t-2 border-[#E31E24] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Brand columns by category */}
          <div className="flex-1 grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(groups.length, 4)}, 1fr)` }}>
            {groups.map(group => (
              <div key={group.label}>
                <button onClick={() => { navigate(`/devices?category=${group.category}`); onClose(); }}
                  className="flex items-center gap-2 mb-3 group w-full text-left">
                  <div className="w-1 h-4 rounded-full bg-[#E31E24]" />
                  <span className="font-bold text-xs text-[#111] group-hover:text-[#E31E24] uppercase tracking-wide transition-colors">
                    {group.label}
                  </span>
                </button>
                <div className="space-y-0.5">
                  {group.brands.map(b => (
                    <button key={b.brand}
                      onClick={() => { navigate(b.routeKey ? `/devices/${b.routeKey}` : `/devices?category=${b.category}`); onClose(); }}
                      className="block w-full text-left px-2 py-1.5 text-sm text-[#555] hover:text-[#E31E24] hover:bg-red-50 rounded-lg transition-all">
                      {b.brand}
                      {b.count > 0 && <span className="text-[#BBB] text-xs ml-1">({b.count})</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right CTA */}
          <div className="w-52 shrink-0 space-y-3">
            <div className="bg-[#111] rounded-2xl p-4 text-center">
              <p className="text-white font-bold text-sm mb-1">Not sure?</p>
              <p className="text-white/60 text-xs mb-3">Free diagnosis for any device</p>
              <Link to="/book" onClick={onClose}
                className="block w-full bg-[#E31E24] hover:bg-[#C01017] text-white rounded-xl py-2.5 text-sm font-bold transition-colors">
                Book a Repair
              </Link>
            </div>
            <Link to="/devices" onClick={onClose}
              className="flex items-center justify-center gap-2 border-2 border-[#E31E24] text-[#E31E24] hover:bg-[#E31E24] hover:text-white rounded-xl py-2.5 text-sm font-bold transition-all">
              View All Devices
            </Link>
            <div className="bg-[#F8F8F8] rounded-xl p-3">
              <p className="text-xs font-bold text-[#111] mb-2">⚡ Quick Facts</p>
              {['Same-day service', 'No fix, no pay', '3–6 month warranty'].map(f => (
                <p key={f} className="text-xs text-[#555] py-0.5">✓ {f}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Services Mega Menu
const ServicesMega = ({ onClose }) => (
  <div className="bg-white border-t-2 border-[#E31E24] shadow-2xl">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex gap-8">
        <div className="flex-1 grid grid-cols-4 gap-3">
          {SERVICES_LIST.map(s => (
            <Link key={s.label} to={s.href} onClick={onClose}
              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
              <span className="text-2xl shrink-0">{s.icon}</span>
              <div>
                <p className="font-bold text-sm text-[#111] group-hover:text-[#E31E24] transition-colors">{s.label}</p>
                <p className="text-xs text-[#777] mt-0.5">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="w-52 shrink-0 space-y-3">
          <div className="bg-gradient-to-br from-[#E31E24] to-[#C01017] rounded-2xl p-4 text-center">
            <p className="text-white font-bold text-sm mb-1">Free Quote</p>
            <p className="text-white/80 text-xs mb-3">Upfront price before we start</p>
            <Link to="/book" onClick={onClose}
              className="block w-full bg-white text-[#E31E24] rounded-xl py-2.5 text-sm font-bold hover:bg-gray-50 transition-colors">
              Get a Quote →
            </Link>
          </div>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" onClick={onClose}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl py-2.5 text-sm font-bold transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  </div>
);

export const Navbar = () => {
  const { brands } = useBrandsData();
  const [isOpen, setIsOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => { setIsOpen(false); setOpenMobile(null); setActiveMenu(null); }, [location]);

  const handleEnter = (menu) => { clearTimeout(timeoutRef.current); setActiveMenu(menu); };
  const handleLeave = () => { timeoutRef.current = setTimeout(() => setActiveMenu(null), 150); };

  const simpleLinks = [
    { name: 'Devices',     href: '/devices' },
    { name: 'Accessories', href: '/accessories' },
    { name: 'About',       href: '/about' },
    { name: 'Contact',     href: '/contact' },
  ];

  // Mobile grouped brands
  const mobileGroups = [
    { label: 'Phones',  brands: brands.filter(b => b.category === 'phones'),  category: 'phones' },
    { label: 'Tablets', brands: brands.filter(b => b.category === 'tablets'), category: 'tablets' },
    { label: 'Laptops', brands: brands.filter(b => b.category === 'laptops'), category: 'laptops' },
    { label: 'Watches', brands: brands.filter(b => b.category === 'watches'), category: 'watches' },
  ].filter(g => g.brands.length > 0);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <motion.header initial={{ y: -100 }} animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#111111] shadow-lg" data-testid="navbar">
          <nav className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center shrink-0" data-testid="navbar-logo">
                <img src={LOGO_URL} alt="HiFone" className="h-10 w-auto"
                  onError={(e) => { e.target.src = 'https://www.hifone.com.au/assets/frontend/images/logo.png'; }} />
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-0.5">
                <div onMouseEnter={() => handleEnter('repair')} onMouseLeave={handleLeave}>
                  <button className={cn('flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all',
                    activeMenu === 'repair' ? 'text-white bg-[#E31E24]' : 'text-white/80 hover:text-white hover:bg-white/10')}>
                    Repair <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', activeMenu === 'repair' && 'rotate-180')} />
                  </button>
                </div>
                <div onMouseEnter={() => handleEnter('services')} onMouseLeave={handleLeave}>
                  <button className={cn('flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all',
                    activeMenu === 'services' ? 'text-white bg-[#E31E24]' : 'text-white/80 hover:text-white hover:bg-white/10')}>
                    Services <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', activeMenu === 'services' && 'rotate-180')} />
                  </button>
                </div>
                {simpleLinks.map(link => (
                  <Link key={link.name} to={link.href} onMouseEnter={handleLeave}
                    className={cn('px-4 py-2 text-sm font-medium rounded-full transition-all',
                      location.pathname === link.href ? 'text-[#E31E24]' : 'text-white/80 hover:text-white hover:bg-white/10')}>
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                <a href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" /> {PHONE_NUMBER}
                </a>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-4 h-9 text-sm font-semibold flex items-center gap-1.5 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <Link to="/book"
                  className="bg-[#E31E24] hover:bg-[#C01017] text-white rounded-full px-5 h-9 text-sm font-semibold flex items-center transition-colors">
                  Book Repair
                </Link>
              </div>

              <button onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-white rounded-full hover:bg-white/10 transition-colors">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </motion.header>

        {/* Desktop Mega Menus */}
        <AnimatePresence>
          {activeMenu === 'repair' && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
              onMouseEnter={() => handleEnter('repair')} onMouseLeave={handleLeave}>
              <RepairMega brands={brands} onClose={() => setActiveMenu(null)} />
            </motion.div>
          )}
          {activeMenu === 'services' && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
              onMouseEnter={() => handleEnter('services')} onMouseLeave={handleLeave}>
              <ServicesMega onClose={() => setActiveMenu(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              className="lg:hidden bg-[#111111] border-t border-white/10 overflow-hidden">
              <div className="py-3 max-h-[75vh] overflow-y-auto">

                {/* Repair accordion */}
                <button onClick={() => setOpenMobile(openMobile === 'repair' ? null : 'repair')}
                  className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-white hover:bg-white/10 rounded-xl mx-2 transition-colors">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#E31E24]" /> Repair</span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform text-white/50', openMobile === 'repair' && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openMobile === 'repair' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      {mobileGroups.map(group => (
                        <div key={group.label} className="px-4 pb-2">
                          <p className="px-4 py-1.5 text-xs font-black text-[#E31E24] uppercase tracking-wider">{group.label}</p>
                          <div className="grid grid-cols-2 gap-1">
                            {group.brands.map(b => (
                              <Link key={b.brand}
                                to={b.routeKey ? `/devices/${b.routeKey}` : `/devices?category=${b.category}`}
                                className="px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                {b.brand}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Services accordion */}
                <button onClick={() => setOpenMobile(openMobile === 'services' ? null : 'services')}
                  className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-white hover:bg-white/10 rounded-xl mx-2 transition-colors">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#E31E24]" /> Services</span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform text-white/50', openMobile === 'services' && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openMobile === 'services' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="px-4 pb-2 grid grid-cols-2 gap-1">
                        {SERVICES_LIST.map(item => (
                          <Link key={item.label} to={item.href}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                            <span>{item.icon}</span> {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="px-2">
                  {simpleLinks.map(link => (
                    <Link key={link.name} to={link.href}
                      className={cn('flex items-center gap-2 px-4 py-3 text-base font-medium rounded-xl transition-colors',
                        location.pathname === link.href ? 'text-[#E31E24] bg-[#E31E24]/10' : 'text-white hover:bg-white/10')}>
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="px-4 pt-3 space-y-2">
                  <a href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
                    className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-white/10 rounded-full">
                    <Phone className="w-4 h-4" /> {PHONE_NUMBER}
                  </a>
                  <Link to="/book"
                    className="flex items-center justify-center py-3 text-base font-bold text-white bg-[#E31E24] hover:bg-[#C01017] rounded-full transition-colors">
                    Book Repair →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#111111] border-t border-white/10">
        <div className="grid grid-cols-3 divide-x divide-white/10">
          <a href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`}
            className="flex flex-col items-center justify-center py-3 gap-1 text-white min-h-[56px]">
            <Phone className="w-5 h-5 text-[#E31E24]" />
            <span className="text-xs font-medium">Call Now</span>
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 gap-1 text-white min-h-[56px]">
            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span className="text-xs font-medium">WhatsApp</span>
          </a>
          <Link to="/book" className="flex flex-col items-center justify-center py-3 gap-1 bg-[#E31E24] text-white min-h-[56px]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <span className="text-xs font-semibold">Book Repair</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;