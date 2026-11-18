import React from 'react';

const ContactHeroSection: React.FC = () => {
  return (
    <section className="bg-[#F9F7F2] border-b border-[rgba(230,224,218,0.5)] py-20">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="font-fraunces text-6xl text-[#221410] mb-6">
            We'd Love to Hear From You
          </h1>

          {/* Subtitle */}
          <p className="font-manrope text-lg text-[#4B5563] leading-relaxed max-w-[672px] mx-auto">
            Contact us about buying, selling, or renting residential, commercial, and industrial property in Haridwar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;