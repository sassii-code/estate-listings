import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

const HeroSection: React.FC = () => {
  const phone = import.meta.env.VITE_BUSINESS_PHONE?.trim();
  const phoneHref = phone?.replace(/[^\d+]/g, '');

  return (
    <section className="bg-[#EEF0EC] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1080px] text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-[#2E3A3F] sm:text-6xl">
          Discover the best properties in Haridwar
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-[#2E3A3F] sm:text-2xl">
          Homes, shops, plots and industrial land. Buy, sell or rent.
        </p>

        {phoneHref && (
          <a
            href={`tel:${phoneHref}`}
            className="mx-auto mt-10 inline-flex min-h-16 w-full max-w-2xl items-center justify-center gap-3 rounded-xl bg-[#F2A900] px-6 py-4 text-xl font-bold text-[#2E3A3F] shadow-md focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#0F5E5A] sm:text-2xl"
          >
            <Phone className="h-6 w-6" aria-hidden="true" />
            Call now: {phone}
          </a>
        )}

        <div className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          <Link to="/properties?purpose=Sale" className="flex min-h-14 items-center justify-center rounded-xl bg-[#0F5E5A] px-5 py-3 text-lg font-bold text-white hover:bg-[#2E3A3F]">
            Buy
          </Link>
          <Link to="/properties?purpose=Rent" className="flex min-h-14 items-center justify-center rounded-xl bg-[#0F5E5A] px-5 py-3 text-lg font-bold text-white hover:bg-[#2E3A3F]">
            Rent
          </Link>
          <Link to="/sell-property" className="flex min-h-14 items-center justify-center rounded-xl bg-[#2E3A3F] px-5 py-3 text-lg font-bold text-white hover:bg-[#0F5E5A]">
            Sell my property
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
