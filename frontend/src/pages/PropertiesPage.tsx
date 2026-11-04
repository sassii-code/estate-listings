import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid2X2, List } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FilterBar, { FilterState } from '../components/properties/FilterBar';
import PropertiesGrid from '../components/properties/PropertiesGrid';
import LoadingState from '../components/common/LoadingState';
import { propertiesAPI } from '../services/api';
import { useSEO } from '../hooks/useSEO';

export interface Property {
  _id: string;
  title: string;
  location: string;
  locality?: string;
  price: number;
  image: string[];
  bedrooms?: number;
  beds?: number;
  baths?: number;
  area?: number;
  areaUnit?: string;
  areaSqFt?: number;
  sqft?: number;
  purpose?: string;
  category?: string;
  type: string;
  status?: string;
  availability?: string;
  reraNumber?: string;
  description: string;
  amenities: string[];
  phone: string;
}

const CATEGORIES = ['Residential', 'Commercial', 'Industrial'];
const PROPERTY_TYPES = ['Plot', 'Flat', 'House', 'Shop', 'Office', 'Showroom', 'Warehouse', 'Factory', 'Industrial land'];
const LOCALITIES = ['Bhadrabad', 'SIDCUL', 'Jwalapur', 'Haridwar'];
const AREA_UNITS: Record<string, number> = { 'sq ft': 1, 'sq yd/gaj': 9, bigha: 27000 };
const FILTER_PARAMS = ['purpose', 'category', 'type', 'locality', 'budgetMin', 'budgetMax', 'sizeMin', 'sizeMax'];

const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const getOption = (value: string | null, options: string[]) =>
  options.find(option => slugify(option) === slugify(value || ''));

const parseNumberParam = (value: string | null) => {
  if (value === null || value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
};

const parseFilters = (params: URLSearchParams): FilterState => {
  const purposeParam = params.get('purpose');
  const purpose = purposeParam?.toLowerCase() === 'buy'
    ? 'Sale'
    : getOption(purposeParam, ['Sale', 'Rent']);

  return {
    purpose,
    category: getOption(params.get('category'), CATEGORIES),
    type: getOption(params.get('type'), PROPERTY_TYPES),
    locality: getOption(params.get('locality'), LOCALITIES),
    budgetMin: parseNumberParam(params.get('budgetMin')),
    budgetMax: parseNumberParam(params.get('budgetMax')),
    sizeMin: parseNumberParam(params.get('sizeMin')),
    sizeMax: parseNumberParam(params.get('sizeMax')),
  };
};

const areaInSquareFeet = (property: Property) => {
  const storedArea = property.areaSqFt ?? property.sqft;
  if (storedArea != null) {
    const area = Number(storedArea);
    return Number.isFinite(area) ? area : undefined;
  }
  if (property.area == null) return undefined;
  const area = Number(property.area);
  return Number.isFinite(area) ? area * (AREA_UNITS[property.areaUnit || 'sq ft'] || 1) : undefined;
};

const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  useSEO({
    title: 'Browse Properties in Mumbai, Delhi, Bangalore & More',
    description: 'Browse properties for sale or rent. Filter by category, property type, locality, budget, and size.',
    url: 'https://buildestate.vercel.app/properties',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');

  const updateFilters = (nextFilters: FilterState) => {
    const nextParams = new URLSearchParams(searchParams);
    FILTER_PARAMS.forEach(param => nextParams.delete(param));
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        nextParams.set(key, typeof value === 'number' ? String(value) : slugify(value));
      }
    });
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await propertiesAPI.getAll();
        if (data.success && data.property) {
          setProperties(data.property);
        }
      } catch (err: any) {
        console.error('Failed to fetch properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (filters.locality) {
      result = result.filter(p => slugify(p.locality || p.location) === slugify(filters.locality!));
    }
    if (filters.category) {
      result = result.filter(p => slugify(p.category || '') === slugify(filters.category!));
    }
    if (filters.type) {
      result = result.filter(p => slugify(p.type || '') === slugify(filters.type!));
    }
    if (filters.purpose) {
      result = result.filter(p => {
        const purpose = p.purpose || (p.availability?.toLowerCase().includes('rent') ? 'Rent' : 'Sale');
        return slugify(purpose) === slugify(filters.purpose!);
      });
    }
    if (filters.budgetMin !== undefined) {
      result = result.filter(p => p.price >= filters.budgetMin!);
    }
    if (filters.budgetMax !== undefined) {
      result = result.filter(p => p.price <= filters.budgetMax!);
    }
    if (filters.sizeMin !== undefined) {
      result = result.filter(p => {
        const area = areaInSquareFeet(p);
        return area !== undefined && area >= filters.sizeMin!;
      });
    }
    if (filters.sizeMax !== undefined) {
      result = result.filter(p => {
        const area = areaInSquareFeet(p);
        return area !== undefined && area <= filters.sizeMax!;
      });
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'beds': result.sort((a, b) => (b.bedrooms ?? b.beds ?? 0) - (a.bedrooms ?? a.beds ?? 0)); break;
      case 'newest': result.sort((a, b) => b._id.localeCompare(a._id)); break;
    }

    return result;
  }, [properties, filters, sortBy]);

  return (
    <div className="bg-[#FAF8F4] min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-fraunces text-3xl font-semibold text-[#221410]">All Properties</h1>
          <p className="mt-1 font-manrope text-sm text-[#6B7280]">Find a property that fits your needs.</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <FilterBar filters={filters} onFilterChange={updateFilters} />
          <section className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <p className="font-manrope text-sm text-[#6B7280]" aria-live="polite">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="property-sort" className="sr-only">Sort properties</label>
                <select
                  id="property-sort"
                  value={sortBy}
                  onChange={event => setSortBy(event.target.value)}
                  className="h-10 rounded-xl border border-[#E6E0DA] bg-white px-3 text-sm text-[#221410] focus:border-[#D4755B] focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="beds">Most Beds</option>
                </select>
                <div className="flex items-center gap-1 rounded-xl bg-[#F5F1E8] p-1">
                  {([
                    { mode: 'grid', Icon: Grid2X2 },
                    { mode: 'list', Icon: List },
                  ] as const).map(({ mode, Icon }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      aria-label={`${mode} view`}
                      aria-pressed={viewMode === mode}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${viewMode === mode ? 'bg-white text-[#221410] shadow-sm' : 'text-[#6B7280]'}`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading && <LoadingState message="Loading properties…" />}

            {error && !loading && (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <span className="material-icons mb-4 block text-4xl text-[#D4755B]">error_outline</span>
                  <p className="mb-4 font-manrope text-[#374151]">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="rounded-xl bg-[#D4755B] px-6 py-2.5 font-manrope font-bold text-white transition-all hover:bg-[#B86851] active:scale-[0.96]"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && filteredProperties.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-[#D4C4BC] bg-white/70 px-6 py-16"
              >
                <div className="text-center">
                  <span className="material-icons mb-4 block text-5xl text-[#D4C4BC]">search_off</span>
                  <p className="mb-2 font-fraunces text-xl text-[#221410]">No properties match these filters</p>
                  <p className="mb-5 font-manrope text-sm text-[#6B7280]">Try changing your search or clearing the filters.</p>
                  <button
                    type="button"
                    onClick={() => updateFilters({})}
                    className="rounded-lg bg-[#221410] px-4 py-2.5 font-manrope text-sm font-semibold text-white hover:bg-[#44322B]"
                  >
                    Clear filters
                  </button>
                </div>
              </motion.div>
            )}

            {!loading && !error && filteredProperties.length > 0 && (
              <PropertiesGrid properties={filteredProperties} viewMode={viewMode} />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertiesPage;
