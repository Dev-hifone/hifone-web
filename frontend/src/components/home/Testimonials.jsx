import { motion } from 'framer-motion';

const REVIEWS = [
  { name: 'Sarah M.', location: 'Adelaide CBD', rating: 5, text: 'Fixed my iPhone 14 Pro screen in under an hour. Looks brand new!' },
  { name: 'James L.', location: 'Glenelg', rating: 5, text: 'Samsung water damage — they saved everything. Miracle workers!' },
  { name: 'Emma K.', location: 'Norwood', rating: 5, text: 'Best battery replacement in Adelaide. Fast, professional, affordable.' },
  { name: 'Michael R.', location: 'Unley', rating: 5, text: 'Dropped my Pixel, fixed in 45 minutes. Highly recommend!' },
  { name: 'Lisa T.', location: 'Prospect', rating: 5, text: 'Replaced my iPad screen in an hour. Very professional team.' },
  { name: 'David W.', location: 'Mile End', rating: 5, text: 'Samsung battery done quick and affordable. Will definitely return.' },
];

const Stars = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-4 h-4 text-[#FFB800] fill-current" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

export const Testimonials = () => {
  return (
    <section className="py-20 bg-white" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-overline mb-3">Real Reviews</p>
          <h2 className="text-h2 mb-4">What Customers Say</h2>
          <div className="flex items-center justify-center gap-3">
            <Stars />
            <span className="font-bold text-[#111111]">5.0</span>
            <span className="text-[#777777] text-sm">· 150+ Google Reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#F8F8F8] rounded-2xl p-6 border border-gray-100"
            >
              <Stars count={review.rating} />
              <p className="text-[#333333] text-sm leading-relaxed mt-3 mb-4">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#E31E24] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-[#111111] text-sm">{review.name}</p>
                  <p className="text-[#999999] text-xs">{review.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://www.google.com/search?q=HiFone+Kurralta+Park"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-[#E31E24] text-[#E31E24] hover:bg-[#E31E24] hover:text-white rounded-full px-7 py-3 font-bold text-sm transition-all"
          >
            See All Google Reviews →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
