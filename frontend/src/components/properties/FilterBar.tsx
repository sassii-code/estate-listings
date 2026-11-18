import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  purpose?: string;
  category?: string;
  type?: string;
  locality?: string;
  budgetMin?: number;
  budgetMax?: number;
  sizeMin?: number;
  sizeMax?: number;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const CATEGORIES = ['Residential', 'Commercial', 'Industrial'];
const PROPERTY_TYPES = ['Plot', 'Flat', 'House', 'Shop', 'Office', 'Showroom', 'Warehouse', 'Factory', 'Industrial land'];
const LOCALITIES = ['Bhadrabad', 'SIDCUL', 'Jwalapur', 'Haridwar'];

const FilterControls: React.FC<FilterBarProps & { onDone?: () => void }> = ({
  filters,
  onFilterChange,
  onDone,
}) => {
  const setField = (field: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [field]: value || undefined });
  };
  const setNumber = (field: keyof FilterState, value: string) => {
    const number = value === '' ? undefined : Number(value);
    onFilterChange({ ...filters, [field]: number !== undefined && Number.isFinite(number) ? number : undefined });
  };
  const clearFilters = () => {
    onFilterChange({});
    onDone?.();
  };
  const inputClass = 'w-full rounded-lg border border-[#E6E0DA] bg-white px-3 py-2.5 text-sm text-[#221410] focus:border-[#D4755B] focus:outline-none focus:ring-2 focus:ring-[#D4755B]/15';
  const labelClass = 'mb-1.5 block text-base font-semibold text-[#2E3A3F]';

  return (
    <div className="space-y-5">
      <div>
        <p className={labelClass}>Purpose</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Buy', value: 'Sale' },
            { label: 'Rent', value: 'Rent' },
          ].map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setField('purpose', filters.purpose === value ? '' : value)}
              aria-pressed={filters.purpose === value}
              className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                filters.purpose === value
                  ? 'border-[#221410] bg-[#221410] text-white'
                  : 'border-[#E6E0DA] bg-white text-[#374151] hover:border-[#D4755B]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className={labelClass}>Category</span>
        <select value={filters.category || ''} onChange={event => setField('category', event.target.value)} className={inputClass}>
          <option value="">All categories</option>
          {CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
      </label>

      <label className="block">
        <span className={labelClass}>Property type</span>
        <select value={filters.type || ''} onChange={event => setField('type', event.target.value)} className={inputClass}>
          <option value="">All types</option>
          {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </label>

      <label className="block">
        <span className={labelClass}>Locality</span>
        <select value={filters.locality || ''} onChange={event => setField('locality', event.target.value)} className={inputClass}>
          <option value="">All localities</option>
          {LOCALITIES.map(locality => <option key={locality} value={locality}>{locality}</option>)}
        </select>
      </label>

      <fieldset>
        <legend className={`${labelClass} mb-2`}>Budget range (₹)</legend>
        <div className="grid grid-cols-2 gap-2">
          <label>
            <span className="sr-only">Minimum budget in rupees</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Min"
              value={filters.budgetMin ?? ''}
              onChange={event => setNumber('budgetMin', event.target.value)}
              className={inputClass}
            />
          </label>
          <label>
            <span className="sr-only">Maximum budget in rupees</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Max"
              value={filters.budgetMax ?? ''}
              onChange={event => setNumber('budgetMax', event.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className={`${labelClass} mb-2`}>Size range (sq ft)</legend>
        <div className="grid grid-cols-2 gap-2">
          <label>
            <span className="sr-only">Minimum size in square feet</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Min"
              value={filters.sizeMin ?? ''}
              onChange={event => setNumber('sizeMin', event.target.value)}
              className={inputClass}
            />
          </label>
          <label>
            <span className="sr-only">Maximum size in square feet</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Max"
              value={filters.sizeMax ?? ''}
              onChange={event => setNumber('sizeMax', event.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </fieldset>

      <button
        type="button"
        onClick={clearFilters}
        className="w-full rounded-lg border border-[#E6E0DA] px-4 py-2.5 text-sm font-semibold text-[#6B7280] transition-colors hover:border-[#D4755B] hover:text-[#D4755B]"
      >
        Clear filters
      </button>
    </div>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = Object.values(filters).filter(value => value !== undefined).length;
  const appliedFilters = <FilterControls filters={filters} onFilterChange={onFilterChange} />;

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(open => !open)}
          className="flex w-full items-center justify-between rounded-xl border border-[#E6E0DA] bg-white px-4 py-3 font-manrope text-sm font-semibold text-[#221410]"
          aria-expanded={mobileOpen}
        >
          <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Filters</span>
          <span className="text-[#6B7280]">{activeCount ? `${activeCount} applied` : 'Any property'}</span>
        </button>
        {mobileOpen && (
          <div className="mt-4 rounded-xl border border-[#D0D5D1] bg-white p-5">
            {appliedFilters}
          </div>
        )}
      </div>

      <aside className="hidden rounded-2xl border border-[#E6E0DA] bg-white p-5 lg:block">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-fraunces text-xl font-semibold text-[#221410]">Filters</h2>
        </div>
        {appliedFilters}
      </aside>

    </>
  );
};

export default FilterBar;
