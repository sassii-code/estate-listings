export const PROPERTY_PURPOSES = ['Sale', 'Rent'];
export const PROPERTY_CATEGORIES = ['Residential', 'Commercial', 'Industrial'];
export const PROPERTY_TYPES = [
  'Plot', 'Flat', 'House', 'Shop', 'Office', 'Showroom', 'Warehouse', 'Factory', 'Industrial land',
];
export const PROPERTY_LOCALITIES = ['Bhadrabad', 'SIDCUL', 'Jwalapur', 'Haridwar'];
export const PROPERTY_AREA_UNITS = ['sq ft', 'sq yd/gaj', 'bigha'];
export const PROPERTY_STATUSES = ['Available', 'Under offer', 'Sold', 'Rented'];

const SQUARE_FEET_PER_UNIT = { 'sq ft': 1, 'sq yd/gaj': 9, bigha: 27000 };

export function toSquareFeet(area, unit) {
  const value = Number(area);
  const factor = SQUARE_FEET_PER_UNIT[unit];
  return Number.isFinite(value) && value > 0 && factor
    ? Math.round(value * factor * 100) / 100
    : 0;
}

export function formatArea(area, unit, areaSqFt, legacySqFt) {
  const value = Number(area);
  const equivalent = areaSqFt ?? legacySqFt;
  if (Number.isFinite(value) && value > 0) {
    const primary = `${value.toLocaleString('en-IN')} ${unit || 'sq ft'}`;
    return unit && unit !== 'sq ft' && equivalent != null
      ? `${primary} (${Number(equivalent).toLocaleString('en-IN')} sq ft)`
      : primary;
  }
  return equivalent == null ? 'Area not specified' : `${Number(equivalent).toLocaleString('en-IN')} sq ft`;
}