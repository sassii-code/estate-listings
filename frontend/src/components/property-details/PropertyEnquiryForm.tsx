import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { enquiriesAPI } from '../../services/api';

interface PropertyEnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

const PropertyEnquiryForm: React.FC<PropertyEnquiryFormProps> = ({ propertyId, propertyTitle }) => {
  const { search } = useLocation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState(`I'm interested in ${propertyTitle}`);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const utmParameters = new URLSearchParams(search);
      await enquiriesAPI.submit({
        name: name.trim(),
        phone,
        email: email.trim() || undefined,
        question: question.trim(),
        propertyId,
        utm_source: utmParameters.get('utm_source')?.trim() || 'direct',
        utm_medium: utmParameters.get('utm_medium')?.trim() || '',
        utm_campaign: utmParameters.get('utm_campaign')?.trim() || '',
      });
      setSubmitted(true);
    } catch (requestError: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(responseMessage || 'Unable to send your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-[#E6E0DA] bg-white p-6 shadow-sm sm:p-8">
      {submitted ? (
        <p role="status" className="text-center font-manrope text-base font-semibold text-[#221410]">
          Thanks, we'll call you back soon.
        </p>
      ) : (
        <>
          <h2 className="mb-6 font-fraunces text-2xl font-bold text-[#221410]">Ask about this property</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="enquiry-name" className="mb-1.5 block font-manrope text-sm font-medium text-[#374151]">
                Name
              </label>
              <input
                id="enquiry-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-[#D4C4BC] px-4 py-3 font-manrope text-sm focus:border-[#D4755B] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="enquiry-phone" className="mb-1.5 block font-manrope text-sm font-medium text-[#374151]">
                Phone
              </label>
              <input
                id="enquiry-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                pattern="[6-9][0-9]{9}"
                title="Enter a valid 10-digit Indian mobile number."
                maxLength={10}
                required
                className="w-full rounded-lg border border-[#D4C4BC] px-4 py-3 font-manrope text-sm focus:border-[#D4755B] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="enquiry-email" className="mb-1.5 block font-manrope text-sm font-medium text-[#374151]">
                Email <span className="font-normal text-[#6B7280]">(optional)</span>
              </label>
              <input
                id="enquiry-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[#D4C4BC] px-4 py-3 font-manrope text-sm focus:border-[#D4755B] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="enquiry-question" className="mb-1.5 block font-manrope text-sm font-medium text-[#374151]">
                Your question
              </label>
              <textarea
                id="enquiry-question"
                name="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                required
                rows={3}
                className="w-full resize-y rounded-lg border border-[#D4C4BC] px-4 py-3 font-manrope text-sm focus:border-[#D4755B] focus:outline-none"
              />
            </div>
            {error && <p role="alert" className="font-manrope text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#D4755B] px-4 py-3 font-manrope text-sm font-bold text-white transition-colors hover:bg-[#B86851] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Request a call back'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default PropertyEnquiryForm;
