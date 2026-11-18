import React from 'react';

interface ContactMethod {
  icon: string;
  title: string;
  description: string;
  action: string;
  actionLink: string;
  bgColor: string;
}

const OtherWaysSection: React.FC = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
  if (!whatsappNumber) return null;

  const methods: ContactMethod[] = [{
    icon: 'chat',
    title: 'WhatsApp',
    description: 'Message us about buying, selling, or renting property in Haridwar.',
    action: 'Start a WhatsApp chat',
    actionLink: `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`,
    bgColor: 'bg-[#E8F5E9]'
  }];

  return (
    <section className="bg-[#F2EFE9] py-24">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-syne font-bold text-4xl text-[#221410] mb-4">
            Other Ways to Connect
          </h2>
          <p className="font-manrope text-lg text-[#4B5563] leading-relaxed max-w-[640px] mx-auto">
            Get in touch with us directly.
          </p>
        </div>

        {/* Methods Grid */}
        <div className="mx-auto grid max-w-sm grid-cols-1 gap-8">
          {methods.map((method, index) => (
            <div 
              key={index}
              className="bg-white border border-[#E6E0DA] rounded-2xl p-8 hover:shadow-xl transition-all group"
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${method.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className="material-icons text-3xl text-[#D4755B]">
                  {method.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-syne font-bold text-xl text-[#221410] mb-3">
                {method.title}
              </h3>

              {/* Description */}
              <p className="font-manrope font-extralight text-sm text-[#4B5563] leading-relaxed mb-6">
                {method.description}
              </p>

              {/* Action Link */}
              <a 
                href={method.actionLink}
                target={method.actionLink.startsWith('http') ? '_blank' : '_self'}
                rel={method.actionLink.startsWith('http') ? 'noopener noreferrer' : ''}
                className="inline-flex items-center gap-2 font-manrope font-bold text-sm text-[#D4755B] hover:text-[#C05621] transition-[color] group"
              >
                <span>{method.action}</span>
                <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherWaysSection;