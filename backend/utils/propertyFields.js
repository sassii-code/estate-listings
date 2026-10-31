import {
  PROPERTY_AREA_UNITS,
  PROPERTY_CATEGORIES,
  PROPERTY_LOCALITIES,
  PROPERTY_PURPOSES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  SQUARE_FEET_PER_UNIT,
} from "../constants/propertyOptions.js";

export class PropertyInputError extends Error {
  constructor(message) {
    super(message);
    this.name = "PropertyInputError";
    this.statusCode = 400;
  }
}

function parseAmenities(body) {
  if (Array.isArray(body.amenities)) return body.amenities;
  if (typeof body.amenities === "string") {
    try {
      const parsed = JSON.parse(body.amenities);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return body.amenities ? [body.amenities] : [];
    }
  }

  return Object.entries(body)
    .filter(([key]) => /^amenities\[\d+\]$/.test(key))
    .sort(([a], [b]) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))
    .map(([, value]) => value);
}

function parseOptionalNumber(value, label) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new PropertyInputError(`${label} must be a non-negative number`);
  }
  return parsed;
}

export function calculateAreaSqFt(area, areaUnit) {
  const factor = SQUARE_FEET_PER_UNIT[areaUnit];
  if (!factor) throw new PropertyInputError("Invalid area unit");
  return Math.round(Number(area) * factor * 100) / 100;
}

export function parsePropertyFields(body) {
  const required = ["title", "description", "phone", "purpose", "category", "type", "locality", "status", "price", "area", "areaUnit"];
  const missing = required.filter((field) => !String(body[field] ?? "").trim());
  if (missing.length) {
    throw new PropertyInputError(`Missing required fields: ${missing.join(", ")}`);
  }

  if (!PROPERTY_PURPOSES.includes(body.purpose)) throw new PropertyInputError("Invalid property purpose");
  if (!PROPERTY_CATEGORIES.includes(body.category)) throw new PropertyInputError("Invalid property category");
  if (!PROPERTY_TYPES.includes(body.type)) throw new PropertyInputError("Invalid property type");
  if (!PROPERTY_LOCALITIES.includes(body.locality)) throw new PropertyInputError("Invalid locality");
  if (!PROPERTY_STATUSES.includes(body.status)) throw new PropertyInputError("Invalid property status");
  if (!PROPERTY_AREA_UNITS.includes(body.areaUnit)) throw new PropertyInputError("Invalid area unit");

  const price = parseOptionalNumber(body.price, "Price");
  const area = parseOptionalNumber(body.area, "Area");
  const bedrooms = parseOptionalNumber(body.bedrooms, "Bedrooms");
  const baths = parseOptionalNumber(body.baths, "Bathrooms");
  if (price === undefined || price === 0 || area === undefined || area === 0) {
    throw new PropertyInputError("Price and area must be greater than zero where applicable");
  }

  const areaSqFt = calculateAreaSqFt(area, body.areaUnit);
  const locality = body.locality.trim();
  const location = locality === "Haridwar"
    ? "Haridwar, Uttarakhand"
    : `${locality}, Haridwar, Uttarakhand`;

  return {
    title: body.title.trim(),
    location,
    locality,
    price,
    purpose: body.purpose,
    category: body.category,
    type: body.type,
    area,
    areaUnit: body.areaUnit,
    areaSqFt,
    bedrooms,
    reraNumber: String(body.reraNumber ?? "").trim(),
    status: body.status,
    description: body.description.trim(),
    phone: body.phone.trim(),
    baths,
    amenities: parseAmenities(body),
    availability: body.purpose === "Rent" ? "rent" : "sale",
    beds: bedrooms,
    sqft: areaSqFt,
    googleMapLink: String(body.googleMapLink ?? "").trim(),
  };
}