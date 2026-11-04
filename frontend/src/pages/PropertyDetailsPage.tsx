import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SimpleFooter from '../components/common/SimpleFooter';
import LoadingState from '../components/common/LoadingState';
import PropertyBreadcrumb from '../components/property-details/PropertyBreadcrumb';
import PropertyHeroImage from '../components/property-details/PropertyHeroImage';
import PropertyHeader from '../components/property-details/PropertyHeader';
import PropertyAbout from '../components/property-details/PropertyAbout';
import PropertyAmenities from '../components/property-details/PropertyAmenities';
import PropertyLocation from '../components/property-details/PropertyLocation';
import ScheduleViewingCard from '../components/property-details/ScheduleViewingCard';
import PropertyEnquiryForm from '../components/property-details/PropertyEnquiryForm';
import PropertyContactActions from '../components/properties/PropertyContactActions';
import { propertiesAPI } from '../services/api';
import { useSEO } from '../hooks/useSEO';
import StructuredData from '../components/common/StructuredData';
import { formatPrice } from '../utils/formatPrice';
import { formatArea } from '../utils/formatArea';
import { getPropertyContactLinks } from '../utils/propertyContact';

interface PropertyData {
  _id: string;
  title: string;
  location: string;
  locality?: string;
  price: number;
  image: string[];
  bedrooms?: number;
  beds?: number;
  baths?: number;
  area?: number;
  areaUnit?: string;
  areaSqFt?: number;
  sqft?: number;
  purpose?: string;
  category?: string;
  type: string;
  status?: string;
  availability?: string;
  description: string;
  amenities: string[];
  phone: string;
  googleMapLink?: string;
  reraNumber?: string;
}

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic SEO based on loaded property
  useSEO({
    title: property ? `${property.title} - ${property.location}` : 'Property Details',
    description: property
      ? `${property.title} in ${property.locality || property.location}. ${property.type} property.`
      : 'View property details on BuildEstate.',
    image: property?.image?.[0] || undefined,
    url: property ? `https://buildestate.vercel.app/property/${property._id}` : undefined,
    type: 'article',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const { data } = await propertiesAPI.getById(id);
        if (data.success && data.property) {
          setProperty(data.property);
        } else {
          setError('Property not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch property:', err);
        setError('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (property && window.location.hash === '#property-enquiry') {
      document.getElementById('property-enquiry')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [property]);

  const marketStatus = ['Available', 'Under offer', 'Sold', 'Rented'].includes(property?.status || '')
    ? property!.status!
    : property?.availability?.toLowerCase() === 'sold' ? 'Sold' : 'Available';
  const purpose = property?.purpose || (property?.availability?.toLowerCase() === 'rent' ? 'Rent' : 'Sale');
  const areaLabel = property ? formatArea(property) : '';
  const contactLinks = property
    ? getPropertyContactLinks(property._id, property.title)
    : { callHref: undefined, whatsAppHref: undefined };

  const scrollToEnquiry = () => {
    document.getElementById('property-enquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <LoadingState message="Loading property details..." />
        <SimpleFooter />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <span className="material-icons text-5xl text-[#D4755B] mb-4">error_outline</span>
            <p className="font-manrope text-xl text-[#374151] mb-4">{error || 'Property not found'}</p>
            <Link
              to="/properties"
              className="bg-[#D4755B] text-white font-manrope font-bold px-8 py-3 rounded-lg hover:bg-[#B86851] transition-all inline-block"
            >
              Back to Properties
            </Link>
          </div>
        </div>
        <SimpleFooter />
      </div>
    );
  }

  // Extract city from location string (e.g. "Satellite, Ahmedabad, Gujarat" → "Ahmedabad")
  // Indian addresses typically end with state, so use second-to-last part as city
  const cityParts = property.location.split(',').map(s => s.trim());
  const city = cityParts.length >= 3
    ? cityParts[cityParts.length - 2]       // "Area, City, State" → City
    : cityParts.length === 2
      ? cityParts[0]                         // "City, State" → City
      : cityParts[0];                        // "City" → City

  // Parse amenities — handle legacy data where amenities may be a JSON string
  const parseAmenities = (amenities: string[]): string[] => {
    if (!amenities || amenities.length === 0) return [];
    // If single element that looks like a JSON array, parse it
    if (amenities.length === 1 && typeof amenities[0] === 'string' && amenities[0].startsWith('[')) {
      try {
        const parsed = JSON.parse(amenities[0]);
        if (Array.isArray(parsed)) return parsed;
      } catch { /* fall through */ }
    }
    return amenities;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-16 md:pb-0">
      {/* Property Structured Data for SEO */}
      <StructuredData
        type="property"
        data={{
          title: property.title,
          description: property.description,
          location: city,
          region: cityParts[cityParts.length - 1] || '',
          price: property.price,
          sqft: property.areaSqFt ?? property.sqft,
          beds: property.bedrooms ?? property.beds,
          baths: property.baths,
          image: property.image?.[0],
        }}
      />
      <StructuredData
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Properties', url: '/properties' },
            { name: city, url: `/properties?location=${encodeURIComponent(city)}` },
            { name: property.title, url: `/property/${property._id}` },
          ],
        }}
      />

      {/* Navigation */}
      <Navbar />

      {/* Breadcrumb Navigation */}
      <PropertyBreadcrumb
        city={city}
        propertyName={property.title}
      />

      {/* Hero Image — adaptive gallery */}
      <PropertyHeroImage images={property.image} propertyName={property.title} />

      {/* Property Header with Price & Specs */}
      <PropertyHeader
        status={marketStatus}
        refNumber={`#${property._id.slice(-8).toUpperCase()}`}
        name={property.title}
        location={property.locality ? `${property.locality}, Haridwar, Uttarakhand` : property.location}
        price={`${formatPrice(property.price)}${purpose === 'Rent' ? ' /mo' : ''}`}
        beds={property.bedrooms ?? property.beds}
        baths={property.baths}
        area={areaLabel}
        reraNumber={property.reraNumber}
      />
      {(contactLinks.callHref || contactLinks.whatsAppHref) && (
        <div className="mx-auto max-w-[1280px] px-8 pt-5">
          <PropertyContactActions
            propertyId={property._id}
            propertyTitle={property.title}
            className="max-w-sm"
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-[#F2EFE9] py-12">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#E6E0DA] rounded-2xl p-8 shadow-sm">
                {/* About Section */}
                <PropertyAbout description={property.description} />

                {/* Amenities Section */}
                <PropertyAmenities
                  amenities={parseAmenities(property.amenities)}
                />

                {/* Location Section */}
                <PropertyLocation
                  location={property.location}
                  propertyName={property.title}
                  googleMapLink={property.googleMapLink}
                />
              </div>
            </div>

            {/* Right Column - Schedule Viewing Sidebar */}
            <div className="lg:col-span-1">
              <ScheduleViewingCard
                property={{ name: property.title, id: property._id }}
                price={`${formatPrice(property.price)}${purpose === 'Rent' ? ' /month' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>

      <section id="property-enquiry" className="scroll-mt-24 bg-[#FAF8F4] px-6 py-12">
        <PropertyEnquiryForm propertyId={property._id} propertyTitle={property.title} />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[#E6E0DA] bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(34,20,16,0.12)] backdrop-blur md:hidden">
        {contactLinks.callHref && (
          <a
            href={contactLinks.callHref}
            className="flex flex-1 items-center justify-center rounded-lg border border-[#D4755B] px-2 py-3 text-center font-manrope text-sm font-bold text-[#B86851]"
          >
            Call
          </a>
        )}
        {contactLinks.whatsAppHref && (
          <a
            href={contactLinks.whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center rounded-lg bg-[#25D366] px-2 py-3 text-center font-manrope text-sm font-bold text-white"
          >
            WhatsApp
          </a>
        )}
        <button
          type="button"
          onClick={scrollToEnquiry}
          className="flex-1 rounded-lg bg-[#D4755B] px-2 py-3 text-center font-manrope text-sm font-bold text-white"
        >
          Request a call back
        </button>
      </div>

      {/* Simple Footer */}
      <SimpleFooter />
    </div>
  );
};

export default PropertyDetailsPage;
