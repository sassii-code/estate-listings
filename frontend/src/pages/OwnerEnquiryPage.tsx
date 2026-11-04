import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { enquiriesAPI } from '../services/api';
import { useSEO } from '../hooks/useSEO';

const PROPERTY_TYPES = ['Plot', 'Flat', 'House', 'Shop', 'Office', 'Showroom', 'Warehouse', 'Factory', 'Industrial land'];
const LOCALITIES = ['Bhadrabad', 'SIDCUL', 'Jwalapur', 'Haridwar'];
const inputClass = 'w-full rounded-lg border border-[#D4C4BC] bg-white px-4 py-3 font-manrope text-sm text-[#221410] focus:border-[#D4755B] focus:outline-none focus:ring-2 focus:ring-[#D4755B]/15';
const labelClass = 'mb-1.5 block font-manrope text-sm font-medium text-[#374151]';

const OwnerEnquiryPage: React.FC = () => {
  const { search } = useLocation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [locality, setLocality] = useState('');
  const [purpose, setPurpose] = useState<'Sell' | 'Rent out'>('Sell');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useSEO({
    title: 'Sell or Rent Out Your Property',
    description: 'Share your property details with BuildEstate and our team will call to discuss selling or renting it out.',
    url: 'https://buildestate.vercel.app/sell-property',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const utmParameters = new URLSearchParams(search);
    const price = expectedPrice.trim() ? Number(expectedPrice) : undefined;

    try {
      await enquiriesAPI.submit({
        type: 'Owner',
        name: name.trim(),
        phone,
        propertyType: propertyType || undefined,
        locality: locality || undefined,
        purpose,
        expectedPrice: price,
        question: message.trim() || undefined,
        website: String(formData.get('website') || ''),
        utm_source: utmParameters.get('utm_source')?.trim() || 'direct',
        utm_medium: utmParameters.get('utm_medium')?.trim() || '',
        utm_campaign: utmParameters.get('utm_campaign')?.trim() || '',
      });
      setSubmitted(true);
    } catch (requestError: unknown) {
      const responseMessage = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(responseMessage || 'Unable to send your property details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 text-center">
          <p className="mb-2 font-manrope text-sm font-semibold uppercase tracking-wider text-[#D4755B]">For property owners</p>
          <h1 className="font-fraunces text-3xl font-semibold text-[#221410] sm:text-4xl">Sell or rent out your property</h1>
          <p className="mx-auto mt-3 max-w-xl font-manrope text-sm leading-6 text-[#6B7280]">
            Share a few details and our team will call you to discuss your property.
          </p>
        </div>

        <section className="rounded-2xl border border-[#E6E0DA] bg-white p-6 shadow-sm sm:p-8">
          {submitted ? (
            <p role="status" className="py-8 text-center font-manrope text-base font-semibold text-[#221410]">
              Thanks, we'll call you to discuss your property.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="absolute -left-[10000px]" aria-hidden="true">
                <label htmlFor="owner-website">Leave this field empty</label>
                <input id="owner-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="owner-name" className={labelClass}>Name <span aria-hidden="true">*</span></label>
                <input
                  id="owner-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  required
                  maxLength={120}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="owner-phone" className={labelClass}>Phone <span aria-hidden="true">*</span></label>
                <input
                  id="owner-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={event => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number."
                  maxLength={10}
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label htmlFor="owner-property-type" className="block">
                  <span className={labelClass}>Property type</span>
                  <select id="owner-property-type" value={propertyType} onChange={event => setPropertyType(event.target.value)} className={inputClass}>
                    <option value="">Select type</option>
                    {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </label>

                <label htmlFor="owner-locality" className="block">
                  <span className={labelClass}>Locality</span>
                  <select id="owner-locality" value={locality} onChange={event => setLocality(event.target.value)} className={inputClass}>
                    <option value="">Select locality</option>
                    {LOCALITIES.map(place => <option key={place} value={place}>{place}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label htmlFor="owner-purpose" className="block">
                  <span className={labelClass}>Purpose</span>
                  <select id="owner-purpose" value={purpose} onChange={event => setPurpose(event.target.value as 'Sell' | 'Rent out')} className={inputClass}>
                    <option value="Sell">Sell</option>
                    <option value="Rent out">Rent out</option>
                  </select>
                </label>

                <label htmlFor="owner-price" className="block">
                  <span className={labelClass}>Expected price (₹)</span>
                  <input
                    id="owner-price"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={expectedPrice}
                    onChange={event => setExpectedPrice(event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div>
                <label htmlFor="owner-message" className={labelClass}>Message <span className="font-normal text-[#6B7280]">(optional)</span></label>
                <textarea
                  id="owner-message"
                  rows={4}
                  maxLength={2000}
                  value={message}
                  onChange={event => setMessage(event.target.value)}
                  className={`${inputClass} resize-y`}
                />
              </div>

              {error && <p role="alert" className="font-manrope text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#D4755B] px-4 py-3 font-manrope text-sm font-bold text-white transition-colors hover:bg-[#B86851] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send my property details'}
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OwnerEnquiryPage;
