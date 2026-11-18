import React from 'react';

interface PropertyHeroImageProps {
  images?: string[];
  image?: string;
  propertyName?: string;
}

const PropertyHeroImage: React.FC<PropertyHeroImageProps> = ({ images = [], image, propertyName }) => {
  const gallery = [...new Set([
    ...images,
    ...(image && !images.includes(image) ? [image] : []),
  ])].filter(Boolean);

  if (gallery.length === 0) return null;

  return (
    <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-2 bg-[#EEF0EC] p-2 sm:grid-cols-3 lg:grid-cols-4">
      {gallery.slice(0, 5).map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`${propertyName || 'Property'} photo ${index + 1}`}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-40 w-full object-cover sm:h-56 lg:h-64 ${index === 0 ? 'col-span-2 row-span-2 h-80 sm:h-[29rem] lg:h-[32rem]' : ''}`}
        />
      ))}
    </div>
  );
};

export default PropertyHeroImage;
