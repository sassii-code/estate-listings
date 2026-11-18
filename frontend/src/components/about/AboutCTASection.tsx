import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="bg-[#EC4613] py-24 relative overflow-hidden">
      {/* Background Pattern */}
        <img
          src="/src/images/Abstract architectural texture with light and shadow.png"
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute top-0 left-1/4 w-96"/>

      <div className="max-w-[1280px] mx-auto px-8 text-center relative z-10">
        <h2 className="font-fraunces text-5xl text-white mb-6">
          Looking for Property in Haridwar?
        </h2>
        <p className="font-manrope font-light text-xl text-white/90 mb-10 max-w-[680px] mx-auto">
          Tell us what you are looking for, whether residential, commercial, or industrial.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/properties" className="rounded-xl bg-white px-10 py-4 font-manrope text-lg font-bold text-[#C05621] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all hover:shadow-2xl">
            Browse Properties
          </Link>
          <Link to="/contact" className="rounded-xl border-2 border-white px-10 py-4 font-manrope text-lg font-bold text-white transition-all hover:bg-white hover:text-[#C05621]">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
