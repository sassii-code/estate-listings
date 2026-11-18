import React from 'react';

const ContactInfoCards: React.FC = () => {
  const address = import.meta.env.VITE_BUSINESS_ADDRESS?.trim();
  const phone = import.meta.env.VITE_BUSINESS_PHONE?.trim();
  const email = import.meta.env.VITE_BUSINESS_EMAIL?.trim();

  return (
    <div className="space-y-6">
      {address && (
        <div className="rounded-xl border border-[#E6E0DA] bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(212,117,91,0.1)]">
              <span className="material-icons text-2xl text-[#D4755B]">location_on</span>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-syne text-lg font-bold text-[#221410]">Business Address</h3>
              <p className="mb-3 whitespace-pre-line font-manrope text-sm font-extralight leading-relaxed text-[#4B5563]">
                {address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-manrope text-sm font-medium text-[#D4755B] transition-[color] hover:text-[#C05621]"
              >
                <span>Get Directions</span>
                <span className="material-icons text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {(phone || email) && (
        <div className="rounded-xl border border-[#E6E0DA] bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(212,117,91,0.1)]">
              <span className="material-icons text-2xl text-[#D4755B]">phone</span>
            </div>
            <div className="flex-1">
              <h3 className="mb-3 font-syne text-lg font-bold text-[#221410]">Call or Email Us</h3>
              <div className="space-y-2">
                {phone && (
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                    className="flex items-center gap-2 font-manrope text-sm font-extralight text-[#4B5563] transition-[color] hover:text-[#D4755B]"
                  >
                    <span className="material-icons text-base">call</span>
                    <span>{phone}</span>
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 font-manrope text-sm font-extralight text-[#4B5563] transition-[color] hover:text-[#D4755B]"
                  >
                    <span className="material-icons text-base">email</span>
                    <span>{email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfoCards;