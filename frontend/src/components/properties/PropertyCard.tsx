import React from 'react';
import { Link } from 'react-router-dom';
import PropertyContactActions from './PropertyContactActions';

interface PropertyCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  location: string;
  beds?: number;
  baths?: number;
  area: string;
  category?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  image,
  name,
  price,
  location,
  beds,
  baths,
  area,
  category,
}) => (
  <article className="h-full overflow-hidden rounded-2xl border border-[#D0D5D1] bg-white shadow-sm">
    <Link
      to={`/property/${id}`}
      aria-label={`See details for property in ${location}`}
      className="block aspect-[4/3] overflow-hidden bg-[#EEF0EC] focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#0F5E5A]"
    >
      <img
        src={image}
        alt={name}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </Link>
    <div className="space-y-3 p-5">
      <p className="text-3xl font-bold leading-tight text-[#2E3A3F]">{price}</p>
      <p className="text-lg font-semibold text-[#2E3A3F]">{location}</p>
      <div className="text-base leading-relaxed text-[#2E3A3F]">
        <p>{area}</p>
        {category === 'Residential' && (beds != null || baths != null) && (
          <p>
            {beds != null && `${beds} ${beds === 1 ? 'bedroom' : 'bedrooms'}`}
            {beds != null && baths != null && ' · '}
            {baths != null && `${baths} ${baths === 1 ? 'bathroom' : 'bathrooms'}`}
          </p>
        )}
      </div>
      <PropertyContactActions propertyId={id} propertyTitle={name} />
    </div>
  </article>
);

export default PropertyCard;
