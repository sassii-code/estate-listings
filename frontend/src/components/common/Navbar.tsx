import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Phone } from 'lucide-react';

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const phone = import.meta.env.VITE_BUSINESS_PHONE?.trim();
  const phoneHref = phone?.replace(/[^\d+]/g, '');
  const whatsAppNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '');
  const whatsAppHref = whatsAppNumber
    ? `https://wa.me/${whatsAppNumber}`
    : undefined;

  const navigationLink = (path: string, label: string) => (
    <Link
      to={path}
      aria-current={pathname === path ? 'page' : undefined}
      className="flex min-h-12 items-center rounded-lg px-3 font-semibold text-[#0F5E5A] hover:bg-[#EEF0EC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0F5E5A]"
    >
      {label}
    </Link>
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-[#0F5E5A] focus:px-4 focus:py-3 focus:font-bold focus:text-white"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 border-b border-[#D0D5D1] bg-white">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-8"
        >
          <Link to="/" className="shrink-0 font-bold text-[#0F5E5A] sm:text-xl">
            MAA DURGA PROPERTIES
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navigationLink('/properties?purpose=Sale', 'Buy')}
            {navigationLink('/properties?purpose=Rent', 'Rent')}
            {navigationLink('/sell-property', 'Sell my property')}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {phone && phoneHref && (
              <a
                href={`tel:${phoneHref}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#F2A900] px-5 font-bold text-[#2E3A3F] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0F5E5A]"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                <span>Call {phone}</span>
              </a>
            )}
            {whatsAppHref && (
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0F5E5A] px-5 font-bold text-white hover:bg-[#2E3A3F] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0F5E5A] lg:inline-flex"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp us
              </a>
            )}
          </div>

          {phone && phoneHref && (
            <a
              href={`tel:${phoneHref}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#F2A900] px-4 font-bold text-[#2E3A3F] lg:hidden"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span>Call</span>
            </a>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
