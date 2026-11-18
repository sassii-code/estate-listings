import React from 'react';
import { Link } from 'react-router-dom';

const ProcessSection: React.FC = () => {
  return (
    <section className="bg-[#F0EBE5] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left - Sticky Content */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="font-space-mono text-sm text-[#D4755B] uppercase tracking-widest mb-6">Local property help</div>
              <h2 className="font-fraunces text-5xl text-[#111827] mb-6 leading-tight">
                Find the right<br />
                <span className="text-[#D4755B]">property in Haridwar</span>
              </h2>
              <p className="font-manrope font-light text-lg text-[#4b5563] mb-8 leading-relaxed">
                Tell us what you need, and we can help you explore residential, commercial, or industrial property.
              </p>
              <Link to="/contact" className="inline-block rounded-lg bg-[#111827] px-8 py-3 font-manrope font-medium text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all hover:bg-[#1f2937]">
                Talk to our team
              </Link>
            </div>
          </div>

          {/* Right - Process Steps */}
          <div className="lg:col-span-8 space-y-12">
            {/* Step 1 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#d1d5db] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#9ca3af]">01</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#111827] mb-3">Tell us what you need</h3>
                  <p className="font-manrope text-base text-[#4b5563] leading-relaxed">
                    Share whether you are buying, selling, or renting, along with the property type and locality you have in mind.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#d1d5db] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#9ca3af]">02</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#111827] mb-3">Explore suitable properties</h3>
                  <p className="font-manrope text-base text-[#4b5563] leading-relaxed">
                    Browse available homes, business spaces, and industrial properties in Haridwar.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#d1d5db] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#9ca3af]">03</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#111827] mb-3">Arrange a visit</h3>
                  <p className="font-manrope text-base text-[#4b5563] leading-relaxed">
                    Contact us to ask questions and arrange a time to see a property.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-[#d1d5db] rounded-full flex items-center justify-center">
                    <span className="font-space-mono font-bold text-lg text-[#9ca3af]">04</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-syne font-bold text-2xl text-[#111827] mb-3">Move forward with confidence</h3>
                  <p className="font-manrope text-base text-[#4b5563] leading-relaxed">
                    Take the next steps with clear communication from our local property team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
