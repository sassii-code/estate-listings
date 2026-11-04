import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { getPropertyEnquiryUrl } from '../../utils/propertyEnquiry';

interface PropertyCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  location: string;
  beds?: number;
  baths?: number;
  area: string;
  badge?: string;
  tags?: string[];
}

const badgeColor: Record<string, string> = {
  'FOR RENT': 'bg-blue-500',
  'SOLD': 'bg-[#6B7280]',
  'RENTED': 'bg-[#6B7280]',
  'UNDER OFFER': 'bg-amber-500',
  'AVAILABLE': 'bg-emerald-600',
  'HOT': 'bg-[#D4755B]',
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  id, image, name, price, location, beds, baths, area, badge, tags = []
}) => {
  const [favorited, setFavorited] = useState(false);
  const { search } = useLocation();

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]">
      <div className="relative">
        <Link to={`/property/${id}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#D4755B]">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#E6E0DA]">
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              style={{ outline: '1px solid rgba(0,0,0,0.08)', outlineOffset: '-1px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            {badge && (
              <div className={`absolute top-3 left-3 rounded-md px-2.5 py-1 font-space-mono text-[10px] font-bold tracking-wider text-white ${badgeColor[badge] ?? 'bg-[#10B981]'}`}>
                {badge}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8">
              <p className="font-fraunces text-2xl font-bold leading-none tabular-nums text-white">{price}</p>
            </div>
          </div>
        </Link>
        <button
          aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
          onClick={() => setFavorited((current) => !current)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-200 hover:bg-white/40 active:scale-[0.96]"
        >
          <Heart className={`h-4 w-4 transition-colors duration-200 ${favorited ? 'fill-[#D4755B] text-[#D4755B]' : 'text-white'}`} />
        </button>
      </div>

      <Link to={`/property/${id}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#D4755B]">
        <div className="px-4 py-4">
          <h3 className="mb-1.5 line-clamp-2 font-fraunces text-base font-semibold leading-snug text-[#221410] text-wrap-balance">
            {name}
          </h3>
          <div className="mb-3 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D4755B]" aria-hidden />
            <span className="truncate font-manrope text-xs text-[#6B7280]">{location}</span>
          </div>
          <div className="flex items-center gap-1.5 font-manrope text-xs tabular-nums text-[#6B7280]">
            {[
              beds != null && `${beds} ${beds === 1 ? 'Bed' : 'Beds'}`,
              baths != null && `${baths} ${baths === 1 ? 'Bath' : 'Baths'}`,
              area,
            ].filter((spec): spec is string => typeof spec === 'string' && spec.length > 0).map((spec, index) => (
              <React.Fragment key={spec}>
                {index > 0 && <span className="text-[#D4C4BC]">·</span>}
                <span>{spec}</span>
              </React.Fragment>
            ))}
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="rounded border border-[#E6E0DA] px-2 py-0.5 font-manrope text-[10px] uppercase tracking-wider text-[#9CA3AF]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      <div className="px-4 pb-4">
        <Link
          to={getPropertyEnquiryUrl(id, search)}
          className="block w-full rounded-lg bg-[#D4755B] px-4 py-2.5 text-center font-manrope text-sm font-bold text-white transition-colors hover:bg-[#B86851] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4755B]"
        >
          Get price and details
        </Link>
      </div>
    </article>
  );
};

export default PropertyCard;
