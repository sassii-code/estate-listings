import mongoose from 'mongoose';

export const ENQUIRY_STATUSES = ['New', 'Contacted', 'Site visit', 'Closed', 'Not interested'];

const enquirySchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
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
    required: true,
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
