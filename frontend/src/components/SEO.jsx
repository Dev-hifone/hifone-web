import { Helmet } from 'react-helmet-async';
import ogImage from '@/assets/Logo/og-image.png'
import { homeFaqs } from '@/data/faqs'

const DEFAULT_SEO = {
  siteName: 'HiFone',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://www.hifone.com.au',
  defaultTitle: 'Best Mobile Phone Repairs in Kurralta Park, Adelaide | HiFone',
  defaultDescription: 'Are you looking for a reliable phone repair shop in Adelaide? HiFone provides prompt mobile phone repairs in Kurralta Park, Adelaide. iPhone, Samsung, iPad repairs with 6 months warranty.',
  defaultImage: ogImage,
  twitterHandle: '@hifone',
  phone: '0432977092',
  address: 'Shop 153 Anzac Hwy, Kurralta Park SA 5037, Australia',
};

// FAQ schema uses shared homeFaqs so it matches the visible answers.
const defaultFAQs = homeFaqs;

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
    ? (/hifone/i.test(title) ? title : `${title} | HiFone Mobile Repairs Adelaide`)
    : DEFAULT_SEO.defaultTitle;
  const seoDescription = description || DEFAULT_SEO.defaultDescription;
  const seoImage = image || DEFAULT_SEO.defaultImage;
  const seoUrl = url || DEFAULT_SEO.siteUrl;

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
      latitude: -34.9456,
      longitude: 138.5722,
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
      ratingValue: '4.9',
      reviewCount: '708',
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
      <meta name="geo.position" content="-34.9456;138.5722" />
      <meta name="ICBM" content="-34.9456, 138.5722" />

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
