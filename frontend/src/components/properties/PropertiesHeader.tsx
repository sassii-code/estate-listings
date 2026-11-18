import React from 'react';

interface PropertiesHeaderProps {
  totalProperties?: number;
}

const PropertiesHeader: React.FC<PropertiesHeaderProps> = ({ totalProperties = 0 }) => (
  <div className="border-b border-[#D0D5D1] bg-white py-6">
    <h1 className="text-3xl font-bold text-[#2E3A3F]">All properties</h1>
    <p className="mt-2 text-lg text-[#2E3A3F]">
      Showing {totalProperties} {totalProperties === 1 ? 'property' : 'properties'}
    </p>
  </div>
);

export default PropertiesHeader;
