import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Calendar, User, ArrowLeft } from 'lucide-react';
import { blogApi } from '../lib/api';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion';

const WHATSAPP = 'https://wa.me/61432977092';

const PLACEHOLDER_BLOGS = [
  {
    id: 'blog-1', title: 'How to Protect Your Phone Screen from Damage',
    slug: 'protect-phone-screen',
    excerpt: 'Learn the best practices to keep your phone screen safe from cracks and scratches.',
    content: 'Full content here...',
    author: 'HiFone Team',
    image_url: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'blog-2', title: '5 Signs Your Phone Battery Needs Replacement',
    slug: 'battery-replacement-signs',
    excerpt: 'Is your phone dying too fast? Here are the telltale signs you need a new battery.',
    content: 'Full content here...',
    author: 'HiFone Team',
    image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'blog-3', title: 'What to Do When Your Phone Gets Water Damage',
    slug: 'water-damage-guide',
    excerpt: 'Quick action guide for when your phone takes an unexpected swim.',
    content: 'Full content here...',
    author: 'HiFone Team',
    image_url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80',
    created_at: new Date().toISOString(),
  },
];

const formatDate = (dateStr) => {
  try { return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return ''; }
};

// Single Blog Post View
const BlogPost = ({ slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.getBySlug(slug)
      .then(res => setBlog(res.data))
      .catch(() => setBlog(PLACEHOLDER_BLOGS.find(b => b.slug === slug) || null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#E31E24] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-[#777777]">Blog post not found.</p>
      <Link to="/blog" className="text-[#E31E24] font-semibold hover:underline">← Back to Blog</Link>
    </div>
  );

  return (
    <div data-testid="blog-post">
      <SEO title={blog.title} description={blog.excerpt} />
      <section className="py-16 lg:py-20 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <p className="text-overline mb-3">Blog</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-5">{blog.title}</h1>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(blog.created_at)}</span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{blog.author}</span>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          {blog.image_url && (
            <img src={blog.image_url} alt={blog.title} className="w-full rounded-2xl mb-10 object-cover aspect-video" />
          )}
          <div className="prose prose-lg max-w-none text-[#333333] leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
          <div className="mt-12 p-7 bg-[#F8F8F8] rounded-2xl border-l-4 border-[#E31E24]">
            <p className="font-bold text-[#111111] mb-2">Need a Repair?</p>
            <p className="text-[#555555] text-sm mb-4">Book a same-day repair at HiFone Kurralta Park, Adelaide.</p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/book" className="bg-[#E31E24] hover:bg-[#C01017] text-white rounded-full px-5 py-2.5 text-sm font-bold transition-colors">
                Book Now
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-5 py-2.5 text-sm font-bold transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Blog Listing
export default function BlogPage() {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.getAll()
      .then(res => setBlogs(res.data?.length ? res.data : PLACEHOLDER_BLOGS))
      .catch(() => setBlogs(PLACEHOLDER_BLOGS))
      .finally(() => setLoading(false));
  }, []);

  if (slug) return <BlogPost slug={slug} />;

  return (
    <div data-testid="blog-page">
      <SEO
        title="HiFone Blog — Phone Repair Tips & Guides"
        description="Tips, guides, and news about mobile device care and repair from HiFone Adelaide."
      />

      <section className="py-16 lg:py-24 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-overline mb-3">Our Blog</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Tips & Repair Guides
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Useful tips, how-tos, and news about mobile device care and repair.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 bg-[#F8F8F8] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-[#F8F8F8] border-2 border-transparent hover:border-[#E31E24] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  data-testid={`blog-card-${blog.slug}`}
                >
                  <div className="aspect-video bg-[#E5E5E5] overflow-hidden">
                    {blog.image_url ? (
                      <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📱</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#999999] mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(blog.created_at)}
                      <span>·</span>
                      <User className="w-3.5 h-3.5" />
                      {blog.author}
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#111111] mb-2 group-hover:text-[#E31E24] transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-[#777777] text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 text-[#E31E24] font-bold text-sm hover:gap-2.5 transition-all"
                    >
                      Read More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
