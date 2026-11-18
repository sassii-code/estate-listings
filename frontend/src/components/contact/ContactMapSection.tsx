import React from 'react';

const ContactMapSection: React.FC = () => {
  const address = import.meta.env.VITE_BUSINESS_ADDRESS?.trim();
  if (!address) return null;

  return (
    <section className="bg-[#F2EFE9] py-16">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#E6E0DA] bg-white px-8 py-12 text-center">
          <div>
            <h2 className="mb-3 font-syne text-2xl font-bold text-[#221410]">Business Address</h2>
            <p className="mb-5 whitespace-pre-line font-manrope text-[#4B5563]">{address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-manrope text-sm font-bold text-[#D4755B] hover:text-[#C05621]"
            >
              Open directions <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection;