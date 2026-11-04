import mongoose from 'mongoose';
import Enquiry, { ENQUIRY_STATUSES } from '../models/enquiryModel.js';
import emailService from '../services/emailService.js';
import { getEnquiryNotificationTemplate } from '../email.js';

export const submitEnquiry = async (req, res) => {
  const {
    propertyId,
    name,
    phone,
    email,
    question,
    utm_source,
    utm_medium,
    utm_campaign,
  } = req.body ?? {};

  const normalizedPropertyId = typeof propertyId === 'string' ? propertyId.trim() : '';
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';
  const normalizedQuestion = typeof question === 'string' ? question.trim() : '';

  if (!mongoose.Types.ObjectId.isValid(normalizedPropertyId)
    || !normalizedName
    || !/^[6-9]\d{9}$/.test(normalizedPhone)
    || !normalizedQuestion) {
    return res.status(400).json({ success: false, message: 'Please provide valid enquiry details.' });
  }

  if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const normalizeUtmValue = (value) => typeof value === 'string' ? value.trim() : '';

  try {
    const enquiry = await Enquiry.create({
      propertyId: normalizedPropertyId,
      name: normalizedName,
      phone: normalizedPhone,
      ...(normalizedEmail && { email: normalizedEmail }),
      question: normalizedQuestion,
      utm_source: normalizeUtmValue(utm_source) || 'direct',
      utm_medium: normalizeUtmValue(utm_medium),
      utm_campaign: normalizeUtmValue(utm_campaign),
    });

    if (process.env.ADMIN_EMAIL) {
      await emailService.sendEmailSafely(
        process.env.ADMIN_EMAIL,
        'New Property Enquiry',
        getEnquiryNotificationTemplate(enquiry),
      );
    }

    return res.status(201).json({ success: true, message: 'Enquiry submitted successfully.', enquiryId: enquiry._id });
  } catch (error) {
    console.error('Error saving property enquiry:', error);
    return res.status(500).json({ success: false, message: 'Unable to submit enquiry right now.' });
  }
};

export const getAdminEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('propertyId', 'title')
      .sort({ createdAt: -1 });

    return res.json({ success: true, enquiries });
  } catch (error) {
    console.error('Error fetching property enquiries:', error);
    return res.status(500).json({ success: false, message: 'Unable to fetch enquiries.' });
  }
};

export const updateAdminEnquiry = async (req, res) => {
  const { status, notes } = req.body ?? {};

  if (!ENQUIRY_STATUSES.includes(status) || typeof notes !== 'string') {
    return res.status(400).json({ success: false, message: 'Provide a valid status and notes.' });
  }

  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, notes: notes.trim() },
      { new: true, runValidators: true },
    ).populate('propertyId', 'title');

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    return res.json({ success: true, enquiry });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry ID.' });
    }
    console.error('Error updating property enquiry:', error);
    return res.status(500).json({ success: false, message: 'Unable to update enquiry.' });
  }
};
