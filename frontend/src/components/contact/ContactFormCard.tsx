import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { contactAPI } from '../../services/api';

const ContactFormCard: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear status when user starts typing again
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      // Map frontend fields to backend schema
      await contactAPI.submit({
        name: formData.name.trim(),
        phone: formData.phoneNumber,
        message: formData.message,
      });

      setStatus('success');
      setStatusMessage('Message sent successfully! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', phoneNumber: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(
        err.response?.data?.message || 'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E6E0DA] rounded-2xl p-8 shadow-sm">
      {/* Card Header */}
      <div className="mb-8">
        <h2 className="font-syne font-bold text-2xl text-[#221410] mb-2">
          Send Us a Message
        </h2>
        <p className="font-manrope font-extralight text-sm text-[#4B5563]">
          Fill in the form below and our team will get back to you within 24 hours.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block font-manrope font-semibold text-base text-[#2E3A3F] mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            className="w-full bg-[#F5F1E8] border border-[#E6E0DA] rounded-lg px-4 py-3 font-manrope font-extralight text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#D4755B] transition-[border-color]"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-manrope font-semibold text-base text-[#2E3A3F] mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Your phone number"
            className="w-full bg-[#F5F1E8] border border-[#E6E0DA] rounded-lg px-4 py-3 font-manrope font-extralight text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#D4755B] transition-[border-color]"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block font-manrope font-semibold text-base text-[#2E3A3F] mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us about your inquiry..."
            rows={5}
            className="w-full bg-[#F5F1E8] border border-[#E6E0DA] rounded-lg px-4 py-3 font-manrope font-extralight text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#D4755B] transition-[border-color] resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F2A900] disabled:opacity-60 disabled:cursor-not-allowed text-[#2E3A3F] font-bold text-base py-3.5 rounded-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending…
            </>
          ) : (
            'Send Message'
          )}
        </button>

        {/* Status Message */}
        {status === 'success' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <p className="font-manrope text-sm text-green-700">{statusMessage}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="font-manrope text-sm text-red-700">{statusMessage}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactFormCard;