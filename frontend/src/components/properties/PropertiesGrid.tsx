import React from 'react';
import PropertyCard from './PropertyCard';
import type { Property } from '../../pages/PropertiesPage';
import { formatPrice } from '../../utils/formatPrice';
import { formatArea } from '../../utils/formatArea';

const fallbackImages = [
  'https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=800',
  'https://images.unsplash.com/photo-1695067440629-b5e513976100?w=800',
  'https://images.unsplash.com/photo-1738168279272-c08d6dd22002?w=800',
  'https://images.unsplash.com/photo-1769428003672-296f923d19b2?w=800',
  'https://images.unsplash.com/photo-1761509386107-9baefe0073f2?w=800',
  'https://images.unsplash.com/photo-1762732793012-8bdab3af00b4?w=800',
];

interface PropertiesGridProps {
  properties: Property[];
  viewMode?: 'grid' | 'list';
}

const PropertiesGrid: React.FC<PropertiesGridProps> = ({ properties, viewMode = 'grid' }) => (
  <div className={`w-full pb-16 pt-4 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'grid grid-cols-1 gap-5'}`}>
    {properties.map((property, index) => {
      const purpose = property.purpose || (property.availability?.toLowerCase() === 'rent' ? 'Rent' : 'Sale');
      return (
        <PropertyCard
          key={property._id}
          id={property._id}
          image={property.image?.[0] || fallbackImages[index % fallbackImages.length]}
          name={property.title}
          price={`${formatPrice(property.price)}${purpose === 'Rent' ? ' / month' : ''}`}
          location={property.locality || property.location}
          beds={property.bedrooms ?? property.beds}
          baths={property.baths}
          area={formatArea(property)}
          category={property.category}
        />
      );
    })}
  </div>
);

export default PropertiesGrid;
