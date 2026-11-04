import React from 'react';
import { getPropertyContactLinks } from '../../utils/propertyContact';

interface PropertyContactActionsProps {
  propertyId: string;
  propertyTitle: string;
  className?: string;
}

const PropertyContactActions: React.FC<PropertyContactActionsProps> = ({
  propertyId,
  propertyTitle,
  className = '',
}) => {
  const { callHref, whatsAppHref } = getPropertyContactLinks(propertyId, propertyTitle);

  if (!callHref && !whatsAppHref) return null;

  return (
    <div className={`flex gap-2 ${className}`}>
      {callHref && (
        <a
          href={callHref}
          className="flex-1 rounded-lg border border-[#D4755B] px-3 py-2.5 text-center font-manrope text-sm font-bold text-[#B86851] transition-colors hover:bg-[#D4755B]/10"
        >
          Call
        </a>
      )}
      {whatsAppHref && (
        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg bg-[#25D366] px-3 py-2.5 text-center font-manrope text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
        >
          WhatsApp
        </a>
      )}
    </div>
  );
};

export default PropertyContactActions;
