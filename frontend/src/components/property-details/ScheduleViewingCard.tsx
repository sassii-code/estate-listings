import React, { useState } from 'react';
import { CheckCircle2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { appointmentsAPI } from '../../services/api';

interface ScheduleViewingCardProps {
  property: { name: string; id: string };
  price?: string;
}

const INPUT = "w-full min-h-12 rounded-xl border border-white/60 bg-white px-4 py-3 font-manrope text-base text-[#2E3A3F] placeholder:text-[#2E3A3F] focus:outline-none focus:border-[#0F5E5A]";
const LABEL = "mb-1.5 block font-manrope text-base font-medium text-white";

const ScheduleViewingCard: React.FC<ScheduleViewingCardProps> = ({ property, price }) => {
  const [form, setForm] = useState({ fullName: '', phone: '', date: '', timeSlot: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await appointmentsAPI.schedule({
        propertyId: property.id,
        date: form.date,
        time: form.timeSlot,
        name: form.fullName,
        phone: form.phone,
        message: `Viewing request for ${property.name}`,
      });
      setSuccess(true);
      toast.success('Visit Scheduled!', { description: "We'll confirm within 24 hours." });
      setForm({ fullName: '', phone: '', date: '', timeSlot: '' });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to schedule. Please try again.';
      setError(msg);
      toast.error('Scheduling Failed', { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky top-24 bg-[#221410] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      {/* Price header */}
      <div className="px-6 pt-6 pb-5 border-b border-white/10">
        <p className="mb-1 font-manrope text-base font-semibold text-white">Listed price</p>
        {price && (
          <p className="font-fraunces text-3xl font-bold text-white tabular-nums leading-none">
            {price}
          </p>
        )}
      </div>

      <div className="px-6 py-5">
          {success ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-fraunces text-xl text-white mb-2">Visit Scheduled!</h3>
              <p className="mb-6 font-manrope text-base text-white">
                We'll confirm your appointment within 24 hours.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="min-h-12 font-manrope text-base font-bold text-white hover:underline"
              >
                Schedule another visit
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-4 h-4 text-[#D4755B]" />
                <h3 className="font-manrope text-lg font-semibold text-white">Schedule a viewing</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className={LABEL}>Full Name</label>
                  <input
                    type="text" name="fullName" value={form.fullName} onChange={handleChange}
                    placeholder="Your full name" className={INPUT} required
                  />
                </div>
                <div>
                  <label className={LABEL}>Phone</label>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 98765 43210" className={INPUT} required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL}>Date</label>
                    <input
                      type="date" name="date" value={form.date} onChange={handleChange}
                      className={INPUT + ' [color-scheme:dark]'} required
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Time</label>
                    <select
                      name="timeSlot" value={form.timeSlot} onChange={handleChange}
                      className={INPUT + ' appearance-none cursor-pointer'} required
                    >
                      <option value="" className="bg-[#221410]">Pick time</option>
                      {['09:00','10:00','11:00','14:00','15:00','16:00'].map(t => (
                        <option key={t} value={t} className="bg-[#221410]">
                          {t.replace('09:','9:')}
                          {+t.split(':')[0] < 12 ? ' AM' : ' PM'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <p className="font-manrope text-xs text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-xl bg-[#F2A900] py-3.5 font-bold text-[#2E3A3F] shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Scheduling…' : 'Schedule Visit'}
                </button>

                <p className="pt-1 text-center font-manrope text-base text-white">
                  Confirmed within 24 hours · No spam
                </p>
              </form>
            </div>
          )}
      </div>
    </div>
  );
};

export default ScheduleViewingCard;
