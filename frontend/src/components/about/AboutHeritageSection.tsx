import React from 'react';
import { ArrowRight } from 'lucide-react';
import heritageImage from '../../images/Heritage section.jpg';

const AboutHeritageSection: React.FC = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left - Image with Border */}
          <div className="relative">
            {/* Inner border box */}
            <div className="border-2 border-[rgba(236,70,19,0.2)] rounded-xl p-4">
              {/* Image container with overlay */}
              <div className="relative h-[735px] bg-[rgba(242,239,233,0.3)] border border-[rgba(230,224,218,0.5)] rounded-lg overflow-hidden">
                <div className="absolute inset-4">
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={heritageImage}
                      alt="Architectural detail"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white mix-blend-saturation" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="lg:pt-16">
            {/* Headline */}
            <h2 className="mb-6">
              <span className="font-syne text-[40px] leading-[50px] text-[#221410] block font-semibold">
                Helping You Find the Right
              </span>
              <span className="font-fraunces text-[40px] leading-[50px] text-[#D4755B] block">
                Property in Haridwar
              </span>
            </h2>

            {/* Description Paragraphs */}
            <div className="space-y-6 mb-8">
              <p className="font-manrope font-extralight text-base leading-[26px] text-[#4b5563]">
                Finding the right property takes local knowledge and a clear understanding of what matters to you.
              </p>

              <p className="font-manrope font-extralight text-base leading-[26px] text-[#4b5563]">
                MAA DURGA PROPERTIES works with people looking to buy, sell, or rent residential,
                commercial, and industrial property in Haridwar.
              </p>
            </div>

            {/* Link */}
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 border-b border-[#221410] pb-1 group hover:border-[#D4755B] transition-[border-color]"
            >
              <span className="font-space-mono text-sm text-[#221410] group-hover:text-[#D4755B] transition-[color]">
                Talk to our team
              </span>

              <ArrowRight className="w-4 h-4 text-[#221410] group-hover:text-[#D4755B] transition-[color]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeritageSection;