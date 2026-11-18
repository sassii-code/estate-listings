import React from 'react';
import mainAboutImage from '../../images/Main about image.jpg';

const HomeAboutSection: React.FC = () => {
  const ownerName = import.meta.env.VITE_BUSINESS_OWNER_NAME?.trim();
  const yearsInHaridwar = import.meta.env.VITE_YEARS_IN_HARIDWAR?.trim();
  const address = import.meta.env.VITE_BUSINESS_ADDRESS?.trim();
  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : undefined;

  return (
    <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-[1080px] items-center gap-10 md:grid-cols-2">
        <img
          src={mainAboutImage}
          alt="Haridwar property and local architecture"
          loading="lazy"
          decoding="async"
          className="h-72 w-full rounded-2xl object-cover sm:h-96"
        />
        <div>
          <h2 className="text-4xl font-bold text-[#2E3A3F] sm:text-5xl">About us</h2>
          <p className="mt-5 text-lg leading-relaxed text-[#2E3A3F]">
            Local help with buying, selling, and renting property in Haridwar.
          </p>
          {(ownerName || yearsInHaridwar) && (
            <p className="mt-4 text-lg font-semibold text-[#2E3A3F]">
              {ownerName}
              {ownerName && yearsInHaridwar && ' · '}
              {yearsInHaridwar && `${yearsInHaridwar} years in Haridwar`}
            </p>
          )}
          {address && (
            <p className="mt-4 whitespace-pre-line text-lg text-[#2E3A3F]">{address}</p>
          )}
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-[#0F5E5A] px-5 py-3 font-bold text-[#0F5E5A] hover:bg-[#EEF0EC]"
            >
              Get directions
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeAboutSection;
