import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const WHATSAPP = 'https://wa.me/61432977092';
const PHONE = '0432 977 092';

export const FinalCTA = () => {
  return (
    <section className="py-20 bg-[#E31E24]" data-testid="final-cta-section">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-4">Ready to fix your device?</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Book a Repair Today
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Walk in anytime or book online. Most repairs done in under 60 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="flex items-center justify-center gap-2 bg-white text-[#E31E24] hover:bg-gray-100 rounded-full px-8 h-14 text-base font-bold transition-colors press-effect shadow-lg"
            >
              Book a Repair Now
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#111111]/30 hover:bg-[#111111]/40 text-white border-2 border-white/30 rounded-full px-8 h-14 text-base font-bold transition-colors press-effect"
            >
              WhatsApp Us
            </a>
          </div>
          <a
            href={`tel:${PHONE.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 mt-6 text-white/80 hover:text-white transition-colors text-sm"
          >
            <Phone className="w-4 h-4" />
            Or call {PHONE}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
