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
    <div className={`flex gap-3 ${className}`}>
      {callHref && (
        <a
          href={callHref}
          className="flex min-h-12 flex-1 items-center justify-center rounded-lg bg-[#F2A900] px-3 py-3 text-center font-bold text-[#2E3A3F]"
        >
          Call now
        </a>
      )}
      {whatsAppHref && (
        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 flex-1 items-center justify-center rounded-lg bg-[#0F5E5A] px-3 py-3 text-center font-bold text-white hover:bg-[#2E3A3F]"
        >
          WhatsApp us
        </a>
      )}
    </div>
  );
};

export default PropertyContactActions;
