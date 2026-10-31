import React from 'react';
import { MapPin } from 'lucide-react';

interface PropertyHeaderProps {
  status?: string;
  refNumber?: string;
  name?: string;
  location?: string;
  price?: string;
  beds?: number;
  baths?: number;
  area?: string;
  reraNumber?: string;
}

const statusStyles: Record<string, { dot: string; label: string }> = {
  Available: { dot: 'bg-emerald-500', label: 'Available' },
  'Under offer': { dot: 'bg-amber-400', label: 'Under offer' },
  Sold: { dot: 'bg-[#6B7280]', label: 'Sold' },
  Rented: { dot: 'bg-[#6B7280]', label: 'Rented' },
};

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  status = 'available',
  refNumber,
  name = '',
  location = '',
  beds,
  baths,
  area = '',
  reraNumber,
}) => {
  const statusStyle = statusStyles[status || 'Available'] || statusStyles.Available;
  const specs = [
    beds != null && `${beds} ${beds === 1 ? 'Bedroom' : 'Bedrooms'}`,
    baths != null && `${baths} ${baths === 1 ? 'Bathroom' : 'Bathrooms'}`,
    area,
  ].filter(Boolean);

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-8 pb-0">
      {/* Status + ref */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
          <span className="font-manrope text-xs font-medium text-[#6B7280] uppercase tracking-wider">
            {statusStyle.label}
          </span>
        </div>
        {refNumber && (
          <>
            <span className="text-[#D4C4BC]">·</span>
            <span className="font-space-mono text-xs text-[#9CA3AF]">{refNumber}</span>
          </>
        )}
      </div>

      {/* Name */}
      <h1 className="font-fraunces text-3xl md:text-4xl font-semibold text-[#221410] leading-tight mb-2 text-wrap-balance">
        {name}
      </h1>

      {/* Location */}
      <div className="flex items-center gap-1.5 mb-5">
        <MapPin className="w-4 h-4 text-[#D4755B] shrink-0" aria-hidden />
        <span className="font-manrope text-sm text-[#6B7280]">{location}</span>
      </div>

      {/* Specs — dot-separated inline */}
      <div className="flex flex-wrap items-center gap-2 font-manrope text-sm text-[#374151] border-b border-[#E6E0DA] pb-6">
        {specs.map((spec, index) => (
          <React.Fragment key={spec}>
            {index > 0 && <span className="text-[#D4C4BC]">·</span>}
            <span>{spec}</span>
          </React.Fragment>
        ))}
      </div>
      {reraNumber && <p className="font-manrope text-xs text-[#6B7280] mt-3">RERA: {reraNumber}</p>}
    </div>
  );
};

export default PropertyHeader;
