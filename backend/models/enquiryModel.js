import mongoose from 'mongoose';

export const ENQUIRY_STATUSES = ['New', 'Contacted', 'Site visit', 'Closed', 'Not interested'];

const enquirySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Buyer', 'Owner'],
    default: 'Buyer',
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: function requirePropertyForBuyer() {
      return this.type !== 'Owner';
    },
  },
  propertyType: {
    type: String,
    trim: true,
  },
  locality: {
    type: String,
    trim: true,
  },
  purpose: {
    type: String,
    enum: ['Sell', 'Rent out'],
  },
  expectedPrice: {
    type: Number,
    min: 0,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  question: {
    type: String,
    required: function requireQuestionForBuyer() {
      return this.type !== 'Owner';
    },
    trim: true,
  },
  utm_source: {
    type: String,
    default: 'direct',
    trim: true,
  },
  utm_medium: {
    type: String,
    trim: true,
  },
  utm_campaign: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ENQUIRY_STATUSES,
    default: 'New',
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  timestamps: true,
});

enquirySchema.index({ propertyId: 1, createdAt: -1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
