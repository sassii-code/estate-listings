import React from 'react';
import { Lightbulb, Eye, Award } from 'lucide-react';

const AboutValuesSection: React.FC = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Local knowledge',
      description: 'We focus on property in Haridwar and the needs of the people who live and work here.'
    },
    {
      icon: Eye,
      title: 'Clear communication',
      description: 'We aim to make the details of each property and the next steps easy to understand.'
    },
    {
      icon: Award,
      title: 'Practical support',
      description: 'We help buyers, sellers, and renters explore property options and arrange the next steps.'
    }
  ];

  return (
    <section className="bg-[#F8F6F6] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-syne text-4xl text-[#221410]">
            Driven by Purpose
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-white border border-[#E6E0DA] rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
            >
              {/* Icon Circle */}
              <div className="w-16 h-16 bg-[rgba(236,70,19,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-[#D4755B]" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="font-syne text-xl text-[#221410] mb-4">
                {value.title}
              </h3>

              {/* Description */}
              <p className="font-manrope font-extralight text-sm leading-[22.75px] text-[#4b5563]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValuesSection;