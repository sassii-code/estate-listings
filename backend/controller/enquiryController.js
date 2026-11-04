import mongoose from 'mongoose';
import Enquiry from '../models/enquiryModel.js';

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

    return res.status(201).json({ success: true, message: 'Enquiry submitted successfully.', enquiryId: enquiry._id });
  } catch (error) {
    console.error('Error saving property enquiry:', error);
    return res.status(500).json({ success: false, message: 'Unable to submit enquiry right now.' });
  }
};
