import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home, MessageCircle, Tag } from 'lucide-react';

const GlobalContactBar: React.FC = () => {
  const whatsAppNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '');
  const whatsAppHref = whatsAppNumber ? `https://wa.me/${whatsAppNumber}` : '/contact';

  return (
    <>
      <nav
        aria-label="Quick links"
        className="fixed inset-x-0 bottom-0 z-[60] grid h-[76px] grid-cols-4 border-t border-[#D0D5D1] bg-white lg:hidden"
      >
        <Link to="/properties?purpose=Sale"         className="flex flex-col items-center justify-center gap-1 font-semibold text-[#0F5E5A]">
          <Home className="h-5 w-5" aria-hidden="true" />
          <span>Buy</span>
        </Link>
        <Link to="/properties?purpose=Rent" className="flex flex-col items-center justify-center gap-1 font-semibold text-[#0F5E5A]">
          <Building2 className="h-5 w-5" aria-hidden="true" />
          <span>Rent</span>
        </Link>
        <Link to="/sell-property" className="flex flex-col items-center justify-center gap-1 font-semibold text-[#0F5E5A]">
          <Tag className="h-5 w-5" aria-hidden="true" />
          <span>Sell</span>
        </Link>
        <a
          href={whatsAppHref}
          target={whatsAppNumber ? '_blank' : undefined}
          rel={whatsAppNumber ? 'noopener noreferrer' : undefined}
          className="flex flex-col items-center justify-center gap-1 font-semibold text-[#0F5E5A]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      </nav>

      {whatsAppNumber && (
        <a
          href={`https://wa.me/${whatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 hidden min-h-14 items-center gap-3 rounded-full bg-[#0F5E5A] px-6 font-bold text-white shadow-lg hover:bg-[#2E3A3F] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0F5E5A] lg:inline-flex"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
          WhatsApp us
        </a>
      )}
    </>
  );
};

export default GlobalContactBar;
