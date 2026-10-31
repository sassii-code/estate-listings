import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Property from '../models/propertyModel.js';
import {
  PROPERTY_AREA_UNITS,
  PROPERTY_CATEGORIES,
  PROPERTY_LOCALITIES,
  PROPERTY_PURPOSES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from '../constants/propertyOptions.js';
import { calculateAreaSqFt } from '../utils/propertyFields.js';

dotenv.config({ path: './.env.local' });
dotenv.config();

const REVIEW_STATUSES = ['pending', 'active', 'rejected', 'expired'];
const TYPE_MAP = { Apartment: 'Flat', Villa: 'House' };
const COMMERCIAL_TYPES = new Set(['Shop', 'Office', 'Showroom']);
const INDUSTRIAL_TYPES = new Set(['Warehouse', 'Factory', 'Industrial land']);

function normalizedType(value) {
  const candidate = TYPE_MAP[value] || value;
  return PROPERTY_TYPES.includes(candidate) ? candidate : 'Flat';
}

function normalizedLocality(document) {
  if (PROPERTY_LOCALITIES.includes(document.locality)) return document.locality;
  const location = String(document.location || '').toLowerCase();
  return PROPERTY_LOCALITIES.find((locality) => location.includes(locality.toLowerCase()));
}

async function migratePropertySchema() {
  await mongoose.connect(process.env.MONGO_URI);

  const operations = [];
  const cursor = Property.collection.find({});

  for await (const document of cursor) {
    const oldStatus = document.status;
    const reviewStatus = REVIEW_STATUSES.includes(document.reviewStatus)
      ? document.reviewStatus
      : REVIEW_STATUSES.includes(oldStatus) ? oldStatus : 'active';
    const type = normalizedType(document.type);
    const category = PROPERTY_CATEGORIES.includes(document.category)
      ? document.category
      : INDUSTRIAL_TYPES.has(type) ? 'Industrial'
        : COMMERCIAL_TYPES.has(type) ? 'Commercial' : 'Residential';
    const purpose = PROPERTY_PURPOSES.includes(document.purpose)
      ? document.purpose
      : String(document.availability || '').toLowerCase().includes('rent') ? 'Rent' : 'Sale';
    const areaUnit = PROPERTY_AREA_UNITS.includes(document.areaUnit) ? document.areaUnit : 'sq ft';
    const area = Number(document.area ?? document.sqft ?? 0);
    const areaSqFt = Number(document.areaSqFt ?? calculateAreaSqFt(area, areaUnit));
    const marketStatus = PROPERTY_STATUSES.includes(oldStatus) ? oldStatus : 'Available';
    const locality = normalizedLocality(document);
    const set = {
      purpose,
      category,
      type,
      area,
      areaUnit,
      areaSqFt,
      sqft: areaSqFt,
      status: marketStatus,
      reviewStatus,
      availability: purpose === 'Rent' ? 'rent' : 'sale',
      updatedAt: new Date(),
    };

    const bedrooms = document.bedrooms ?? document.beds;
    if (bedrooms !== undefined && bedrooms !== null && bedrooms !== '') {
      set.bedrooms = Number(bedrooms);
      set.beds = Number(bedrooms);
    }
    if (locality) set.locality = locality;
    if (document.reraNumber === undefined) set.reraNumber = '';

    operations.push({
      updateOne: {
        filter: { _id: document._id },
        update: { $set: set },
      },
    });

    if (operations.length === 500) {
      await Property.collection.bulkWrite(operations);
      operations.length = 0;
    }
  }

  if (operations.length) await Property.collection.bulkWrite(operations);
  console.log('Property schema migration complete.');
  await mongoose.disconnect();
}

migratePropertySchema().catch(async (error) => {
  console.error('Property schema migration failed:', error);
  await mongoose.disconnect();
  process.exitCode = 1;
});