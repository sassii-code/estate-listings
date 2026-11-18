import React from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://buildestate.vercel.app';
const BUSINESS_NAME = 'MAA DURGA PROPERTIES';
const BUSINESS_ADDRESS = import.meta.env.VITE_BUSINESS_ADDRESS?.trim();
const BUSINESS_PHONE = import.meta.env.VITE_BUSINESS_PHONE?.trim();
const BUSINESS_EMAIL = import.meta.env.VITE_BUSINESS_EMAIL?.trim();

interface StructuredDataProps {
  type: 'website' | 'organization' | 'property' | 'localBusiness' | 'breadcrumb' | 'faqPage' | 'howTo' | 'speakable';
  data?: {
    // property listing
    title?: string;
    description?: string;
    location?: string;
    region?: string;
    price?: number;
    sqft?: number;
    beds?: number;
    baths?: number;
    createdAt?: string;
    image?: string;
    // breadcrumb
    breadcrumbs?: Array<{ name: string; url: string }>;
    // faqPage
    faqs?: Array<{ question: string; answer: string }>;
    // howTo
    howToName?: string;
    howToDescription?: string;
    steps?: Array<{ name: string; text: string }>;
    // speakable
    cssSelector?: string[];
  };
}

const AREA_SERVED = ['Haridwar'];

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const location = useLocation();
  const currentUrl = `${SITE_URL}${location.pathname}`;

  const schemas: Record<string, object> = {
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: BUSINESS_NAME,
      url: SITE_URL,
      description: 'Residential, commercial, and industrial property services in Haridwar.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/properties?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },

    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: BUSINESS_NAME,
      url: SITE_URL,
      areaServed: AREA_SERVED,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
        ...(BUSINESS_PHONE && { telephone: BUSINESS_PHONE }),
        ...(BUSINESS_EMAIL && { email: BUSINESS_EMAIL }),
      },
    },

    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: BUSINESS_NAME,
      description: 'Residential, commercial, and industrial property services in Haridwar.',
      url: SITE_URL,
      areaServed: AREA_SERVED.map((city) => ({ '@type': 'City', name: city })),
      address: {
        '@type': 'PostalAddress',
        ...(BUSINESS_ADDRESS && { streetAddress: BUSINESS_ADDRESS }),
        addressLocality: 'Haridwar',
        addressCountry: 'IN',
      },
      ...(BUSINESS_PHONE && { telephone: BUSINESS_PHONE }),
      ...(BUSINESS_EMAIL && { email: BUSINESS_EMAIL }),
    },

    property: {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: data?.title || 'Property Listing',
      description: data?.description || 'Property details',
      url: currentUrl,
      datePosted: data?.createdAt || new Date().toISOString(),
      ...(data?.image && { image: data.image }),
      address: {
        '@type': 'PostalAddress',
        addressLocality: data?.location || 'City',
        addressRegion: data?.region || 'Region',
        addressCountry: 'IN',
      },
      ...(data?.price && { price: `₹${data.price}`, priceCurrency: 'INR' }),
      ...(data?.sqft && {
        floorSize: { '@type': 'QuantitativeValue', unitText: 'SQFT', value: data.sqft },
      }),
      ...(data?.beds && { numberOfRooms: data.beds }),
      ...(data?.baths && { numberOfBathroomsTotal: data.baths }),
    },

    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (data?.breadcrumbs || []).map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
      })),
    },

    faqPage: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (data?.faqs || []).map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },

    speakable: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: currentUrl,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: data?.cssSelector || ['h1', '[data-speakable]'],
      },
    },

    howTo: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: data?.howToName || 'How to Buy Property',
      description: data?.howToDescription || 'Steps to find and buy your perfect home in India.',
      step: (data?.steps || []).map((step) => ({
        '@type': 'HowToStep',
        name: step.name,
        text: step.text,
      })),
    },
  };

  const schemaData = schemas[type] || schemas.website;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default StructuredData;
