import mongoose from "mongoose";
import {
  PROPERTY_AREA_UNITS,
  PROPERTY_CATEGORIES,
  PROPERTY_PURPOSES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from "../constants/propertyOptions.js";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    purpose: {
      type: String,
      enum: PROPERTY_PURPOSES,
      required: true,
    },
    category: {
      type: String,
      enum: PROPERTY_CATEGORIES,
      required: true,
    },
    locality: {
      type: String,
      default: "",
    },
    area: {
      type: Number,
      required: true,
      min: 0,
    },
    areaUnit: {
      type: String,
      enum: PROPERTY_AREA_UNITS,
      required: true,
    },
    areaSqFt: {
      type: Number,
      required: true,
      min: 0,
    },
    bedrooms: {
      type: Number,
      min: 0,
    },
    reraNumber: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: PROPERTY_STATUSES,
      default: "Available",
    },
    // Stored as plain URLs. Admin-panel listings use this directly.
    // User-submitted listings also store URLs here for full compatibility.
    image: {
      type: [String],
      required: true,
    },
    beds: {
      type: Number,
    },
    baths: {
      type: Number,
    },
    sqft: {
      type: Number,
    },
    type: {
      type: String,
      enum: PROPERTY_TYPES,
      required: true,
    },
    availability: {
      type: String,
      default: "sale",
    },
    description: {
      type: String,
      required: true,
    },
    amenities: {
      type: Array,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    googleMapLink: {
      type: String,
      default: "",
    },

    // ── User listing fields ──────────────────────────────────────────────────
    // Listings added via the admin panel leave these at their defaults.
    // Listings submitted by users go through an approval workflow.

    // 'pending'  — awaiting admin review (default for user submissions)
    // 'active'   — approved and visible on the site
    // 'rejected' — not approved; rejectionReason is set
    // 'expired'  — was active but passed expiresAt date
    // Admin-panel listings are saved directly as 'active' (no review needed).
    reviewStatus: {
      type: String,
      enum: ["pending", "active", "rejected", "expired"],
    },

    // Reference to the User who submitted this listing (null for admin entries)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Filled by admin when status is set to 'rejected'
    rejectionReason: {
      type: String,
      default: "",
    },

    // When the listing should automatically expire (null = never, for admin entries)
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

// Database indexes for common query patterns
propertySchema.index({ status: 1 });
propertySchema.index({ reviewStatus: 1 });
propertySchema.index({ createdAt: -1 }); // Sorting by creation date
propertySchema.index({ postedBy: 1 }); // User's own listings
propertySchema.index({ reviewStatus: 1, createdAt: -1 }); // Review queue and public listing sort
propertySchema.index({ postedBy: 1, createdAt: -1 }); // Compound: user listings + sort
propertySchema.index({ expiresAt: 1 }); // Expiry cleanup queries
propertySchema.index({ location: "text", title: "text", description: "text" }); // Text search
propertySchema.index({ price: 1, bedrooms: 1, purpose: 1, category: 1, type: 1, locality: 1 });

const Property = mongoose.model("Property", propertySchema);

export default Property;
