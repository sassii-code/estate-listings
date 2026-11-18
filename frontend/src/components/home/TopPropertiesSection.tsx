import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { propertiesAPI } from '../../services/api';
import type { Property } from '../../pages/PropertiesPage';
import { formatPrice } from '../../utils/formatPrice';
import { formatArea } from '../../utils/formatArea';
import PropertyCard from '../properties/PropertyCard';

const fallbackImage = 'https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=1000';
const VIEW_STORAGE_KEY = 'buildestate-home-properties-view';

const getItemsPerView = () => (
  window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
);

const TopPropertiesSection: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'slide' | 'list'>(() => (
    window.localStorage.getItem(VIEW_STORAGE_KEY) === 'list' ? 'list' : 'slide'
  ));
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideCount = Math.max(1, properties.length - itemsPerView + 1);

  useEffect(() => {
    propertiesAPI.getHomepage()
      .then(({ data }) => {
        if (data.success && Array.isArray(data.property)) {
          setProperties(data.property.slice(0, 10));
        } else {
          setError('Unable to load properties right now.');
        }
      })
      .catch(() => setError('Unable to load properties right now.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(VIEW_STORAGE_KEY, view);
  }, [view]);

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectSlide = (index: number) => {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild as HTMLElement | null;
    if (!track || !firstCard) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const slide = Math.min(index, slideCount - 1);
    track.scrollTo({ left: slide * (firstCard.offsetWidth + gap), behavior: 'smooth' });
    setActiveIndex(slide);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild as HTMLElement | null;
    if (!track || !firstCard) return;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    setActiveIndex(Math.min(
      slideCount - 1,
      Math.round(track.scrollLeft / (firstCard.offsetWidth + gap)),
    ));
  };

  const propertyCard = (property: Property, index: number) => {
    const purpose = property.purpose || (property.availability?.toLowerCase() === 'rent' ? 'Rent' : 'Sale');
    return (
      <PropertyCard
        key={property._id}
        id={property._id}
        image={property.image?.[0] || fallbackImage}
        name={property.title}
        price={`${formatPrice(property.price)}${purpose === 'Rent' ? ' / month' : ''}`}
        location={property.locality || property.location}
        beds={property.bedrooms ?? property.beds}
        baths={property.baths}
        area={formatArea(property)}
        category={property.category}
      />
    );
  };

  return (
    <section aria-labelledby="top-properties-title" className="bg-white px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <h2 id="top-properties-title" className="text-4xl font-bold text-[#2E3A3F] sm:text-5xl">
            Top properties
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setView('slide')}
              aria-pressed={view === 'slide'}
              className={`min-h-12 rounded-lg border px-5 font-semibold ${view === 'slide' ? 'border-[#0F5E5A] bg-[#0F5E5A] text-white' : 'border-[#2E3A3F] text-[#2E3A3F]'}`}
            >
              Slide view
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              className={`min-h-12 rounded-lg border px-5 font-semibold ${view === 'list' ? 'border-[#0F5E5A] bg-[#0F5E5A] text-white' : 'border-[#2E3A3F] text-[#2E3A3F]'}`}
            >
              List view
            </button>
          </div>
        </div>

        {loading && <p role="status" className="py-12 text-center text-lg">Loading properties…</p>}
        {error && !loading && <p role="alert" className="py-12 text-center text-lg">{error}</p>}
        {!loading && !error && properties.length === 0 && (
          <p className="py-12 text-center text-lg">No properties are available yet.</p>
        )}

        {!loading && !error && properties.length > 0 && view === 'slide' && (
          <>
            <div className="mb-5 flex justify-end gap-3">
              <button
                type="button"
                aria-label="Previous properties"
                onClick={() => selectSlide((activeIndex - 1 + slideCount) % slideCount)}
                className="flex h-14 min-h-14 min-w-[136px] items-center justify-center gap-2 rounded-xl border-2 border-[#0F5E5A] px-4 text-[#0F5E5A] hover:bg-[#EEF0EC]"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                aria-label="Next properties"
                onClick={() => selectSlide((activeIndex + 1) % slideCount)}
                className="flex h-14 min-h-14 min-w-[136px] items-center justify-center gap-2 rounded-xl border-2 border-[#0F5E5A] px-4 text-[#0F5E5A] hover:bg-[#EEF0EC]"
              >
                <span>Next</span>
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3"
            >
              {properties.map((property, index) => (
                <div key={property._id} className="w-[88%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]">
                  {propertyCard(property, index)}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-1">
              {properties.slice(0, slideCount).map((property, index) => (
                <button
                  key={property._id}
                  type="button"
                  aria-label={`Show property ${index + 1}`}
                  aria-current={activeIndex === index ? 'true' : undefined}
                  onClick={() => selectSlide(index)}
                  className="flex h-12 w-12 min-h-12 items-center justify-center"
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold ${activeIndex === index ? 'border-[#0F5E5A] bg-[#0F5E5A] text-white' : 'border-[#2E3A3F] bg-[#EEF0EC] text-[#2E3A3F]'}`}>
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {!loading && !error && properties.length > 0 && view === 'list' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(propertyCard)}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/properties"           className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#0F5E5A] px-8 py-4 text-lg font-bold text-white hover:bg-[#2E3A3F]">
            See all properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopPropertiesSection;
