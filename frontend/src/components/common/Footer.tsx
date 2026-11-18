import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const address = import.meta.env.VITE_BUSINESS_ADDRESS?.trim();
  const phone = import.meta.env.VITE_BUSINESS_PHONE?.trim();
  const email = import.meta.env.VITE_BUSINESS_EMAIL?.trim();

  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="mb-4 inline-block font-fraunces text-xl font-bold sm:text-2xl">
              MAA DURGA PROPERTIES
            </Link>
            <p className="font-manrope text-base leading-relaxed text-white">
              Residential, commercial, and industrial property in Haridwar.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-syne text-lg font-bold">Quick Links</h2>
            <ul className="space-y-3 font-manrope text-base text-white">
              <li><Link to="/properties" className="hover:text-white">Browse Properties</Link></li>
              <li><Link to="/sell-property" className="hover:text-white">Sell or Rent Out</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-syne text-lg font-bold">Contact</h2>
            <ul className="space-y-4 font-manrope text-base text-white">
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#D4755B]" />
                  <span className="whitespace-pre-line">{address}</span>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 hover:text-white">
                    <Phone className="h-5 w-5 shrink-0 text-[#D4755B]" />
                    <span>{phone}</span>
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-white">
                    <Mail className="h-5 w-5 shrink-0 text-[#D4755B]" />
                    <span>{email}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center font-manrope text-base text-white">
          © {new Date().getFullYear()} MAA DURGA PROPERTIES. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
