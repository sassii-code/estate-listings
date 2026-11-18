import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Residential', description: 'Homes and residential plots' },
  { name: 'Commercial', description: 'Shops and business spaces' },
  { name: 'Industrial', description: 'Industrial properties and land' },
];

const PropertyCategoriesSection: React.FC = () => (
  <section className="bg-[#EEF0EC] px-5 py-16 sm:px-8 sm:py-20">
    <div className="mx-auto max-w-[1280px]">
      <h2 className="mb-8 text-4xl font-bold text-[#2E3A3F] sm:text-5xl">Browse by property type</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {categories.map(({ name, description }) => (
          <Link
            key={name}
            to={`/properties?category=${encodeURIComponent(name)}`}
            className="flex min-h-48 flex-col justify-center rounded-2xl border border-[#D0D5D1] bg-white p-8 text-[#2E3A3F] shadow-sm hover:border-[#0F5E5A] focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#0F5E5A]"
          >
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="mt-3 text-lg">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default PropertyCategoriesSection;
