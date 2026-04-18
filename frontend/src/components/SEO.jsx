import { Helmet } from 'react-helmet-async';
import ogImage from '@/assets/Logo/og-image.png'

const DEFAULT_SEO = {
  siteName: 'HiFone',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://hifone.com.au',
  defaultTitle: 'Best Mobile Phone Repairs in Kurralta Park, Adelaide | HiFone',
  defaultDescription: 'Are you looking for a reliable phone repair shop in Adelaide? HiFone provides prompt mobile phone repairs in Kurralta Park, Adelaide. iPhone, Samsung, iPad repairs with 6 months warranty.',
  defaultImage: ogImage,
  twitterHandle: '@hifone',
  phone: '0432977092',
  address: 'Shop 153 Anzac Hwy, Kurralta Park SA 5037, Australia',
};

// FAQ Data for schema
const defaultFAQs = [
  {
    question: 'How long does a typical repair take?',
    answer: 'Most repairs are completed within 30-60 minutes while you wait. More complex repairs like water damage may take 24-48 hours for proper diagnosis and treatment.',
  },
  {
    question: 'Do you use genuine parts?',
    answer: 'Yes, we use only high-quality, premium replacement parts. All our parts are thoroughly tested to ensure they meet our quality standards and come with our warranty.',
  },
  {
    question: 'What warranty do you offer?',
    answer: 'All our repairs come with a 6-month warranty covering parts and labor. If you experience any issues related to the repair within this period, we will fix it free of charge.',
  },
  {
    question: 'Do I need to book an appointment?',
    answer: 'While walk-ins are welcome, we recommend booking an appointment to ensure minimal wait times. You can book online or call us to schedule your repair.',
  },
  {
    question: 'What is your No Fix, No Pay policy?',
    answer: 'If we cannot fix your device, you do not pay anything. We only charge when the repair is successfully completed to your satisfaction.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and cash payments. We also offer online payment through our secure checkout system.',
  },
  {
    question: 'Is my data safe during the repair?',
    answer: 'Your privacy is our priority. We do not access your personal data during repairs. However, we recommend backing up your data before any repair as a precaution.',
  },
  {
    question: 'Do you offer pickup and delivery?',
    answer: 'Yes, we offer convenient pickup and delivery services within Adelaide metropolitan area for an additional fee. Contact us for more details.',
  },
];

export const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
  noIndex = false,
  faqs = null,
  service = null,
  device = null,
  location = 'Adelaide',
}) => {
  const seoTitle = title
    ? `${title} | HiFone Mobile Repairs Adelaide`
    : DEFAULT_SEO.defaultTitle;
  const seoDescription = description || DEFAULT_SEO.defaultDescription;
  const seoImage = image || DEFAULT_SEO.defaultImage;
  const seoUrl = url || DEFAULT_SEO.siteUrl;
  const seoKeywords = keywords || 'phone repair adelaide, mobile repair kurralta park, iphone repair adelaide, samsung repair adelaide, screen repair, battery replacement, water damage repair';

  // LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': DEFAULT_SEO.siteUrl,
    name: 'HiFone',
    description: DEFAULT_SEO.defaultDescription,
    url: DEFAULT_SEO.siteUrl,
    telephone: DEFAULT_SEO.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop 153 Anzac Hwy, Kurralta Park',
      addressLocality: 'Adelaide',
      addressRegion: 'SA',
      postalCode: '5037',
      addressCountry: 'AU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -34.9530,
      longitude: 138.5660,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    image: DEFAULT_SEO.defaultImage,
    sameAs: [
      'https://g.page/r/CVxRDB1RTAfvEAo',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '150',
    },
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || defaultFAQs).map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Service Schema (for service pages)
  const serviceSchema = service ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    provider: {
      '@type': 'LocalBusiness',
      name: 'HiFone',
      address: {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressRegion: 'SA',
        addressCountry: 'AU',
      },
    },
    areaServed: {
      '@type': 'City',
      name: location,
    },
    description: service.description,
    offers: device ? {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: `${device.brand} ${device.name}`,
      },
      price: service.price,
      priceCurrency: 'AUD',
    } : undefined,
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: DEFAULT_SEO.siteUrl,
      },
      ...(service ? [{
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${DEFAULT_SEO.siteUrl}/services`,
      }] : []),
      ...(device ? [{
        '@type': 'ListItem',
        position: 3,
        name: `${device.brand} Repair`,
        item: `${DEFAULT_SEO.siteUrl}/devices/${device.brand.toLowerCase()}`,
      }] : []),
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />

      {/* Robots */}
<meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      {/* Canonical */}
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Additional Meta */}
      <meta name="geo.region" content="AU-SA" />
      <meta name="geo.placename" content="Kurralta Park, Adelaide" />
      <meta name="geo.position" content="-34.9530;138.5660" />
      <meta name="ICBM" content="-34.9530, 138.5660" />

      {/* Structured Data - LocalBusiness */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Structured Data - FAQ */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* Structured Data - Service (if applicable) */}
      {serviceSchema && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}

      {/* Structured Data - Breadcrumb */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
