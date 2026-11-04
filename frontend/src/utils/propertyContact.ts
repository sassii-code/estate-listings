export function getPropertyContactLinks(propertyId: string, propertyTitle: string) {
  const businessPhone = import.meta.env.VITE_BUSINESS_PHONE?.trim();
  const normalizedPhone = businessPhone?.replace(/[^\d+]/g, '');
  const phoneForLink = normalizedPhone && /^\+?\d{10,15}$/.test(normalizedPhone)
    ? normalizedPhone
    : undefined;
  const normalizedWhatsAppNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '');
  const whatsAppNumber = normalizedWhatsAppNumber && /^\d{10,15}$/.test(normalizedWhatsAppNumber)
    ? normalizedWhatsAppNumber
    : undefined;
  const listingUrl = new URL(
    `/property/${encodeURIComponent(propertyId)}`,
    window.location.origin,
  ).toString();

  const message = `Hi, I'm interested in ${propertyTitle}. ${listingUrl}`;

  return {
    callHref: phoneForLink ? `tel:${phoneForLink}` : undefined,
    whatsAppHref: whatsAppNumber
      ? `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`
      : undefined,
  };
}
