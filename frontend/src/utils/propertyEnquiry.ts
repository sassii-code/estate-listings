export function getPropertyEnquiryUrl(propertyId: string, search: string): string {
  const utmParameters = new URLSearchParams();
  for (const [key, value] of new URLSearchParams(search)) {
    if (key.startsWith('utm_')) {
      utmParameters.append(key, value);
    }
  }

  const query = utmParameters.toString();
  return `/property/${encodeURIComponent(propertyId)}${query ? `?${query}` : ''}#property-enquiry`;
}
