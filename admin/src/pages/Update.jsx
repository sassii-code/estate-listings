import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import apiClient from '../services/apiClient';
import { X, Upload, Home, MapPin, Phone, DollarSign, BedDouble, Bath, Maximize, Link as LinkIcon, CheckSquare, Square, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { AMENITIES_LIST } from '../constants/amenities';
import { cn } from '../lib/utils';
import {
  PROPERTY_AREA_UNITS,
  PROPERTY_CATEGORIES,
  PROPERTY_LOCALITIES,
  PROPERTY_PURPOSES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  toSquareFeet,
} from '../constants/propertyOptions';

const inputClass = "w-full px-4 py-3 bg-white border border-[#E6D5C3] rounded-xl text-[#1C1B1A] placeholder-[#9CA3AF] text-sm transition-all duration-200 outline-none focus:border-[#D4755B] focus:ring-2 focus:ring-[#D4755B]/15";
const labelClass = "block text-sm font-semibold text-[#1C1B1A] mb-2";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-9 h-9 bg-[#D4755B]/10 rounded-xl flex items-center justify-center">
      <Icon className="w-4.5 h-4.5 text-[#D4755B]" />
    </div>
    <div>
      <h3 className="text-base font-bold text-[#1C1B1A]">{title}</h3>
      {subtitle && <p className="text-xs text-[#9CA3AF]">{subtitle}</p>}
    </div>
  </div>
);

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', purpose: 'Sale', category: 'Residential', type: 'Flat', status: 'Available',
    locality: '', price: '', area: '', areaUnit: 'sq ft', areaSqFt: '',
    bedrooms: '', reraNumber: '', description: '', baths: '', phone: '',
    amenities: [], googleMapLink: '', images: [],
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await apiClient.get(`/api/products/single/${id}`);
        if (response.data.success) {
          const property = response.data.property;
          let amenities = property.amenities || [];
          if (amenities.length === 1 && typeof amenities[0] === 'string' && amenities[0].startsWith('[')) {
            try { amenities = JSON.parse(amenities[0]); } catch { /* keep as-is */ }
          }
          const legacyType = property.type === 'Apartment' ? 'Flat' : property.type === 'Villa' ? 'House' : property.type;
          const type = PROPERTY_TYPES.includes(legacyType) ? legacyType : 'Flat';
          const purpose = PROPERTY_PURPOSES.includes(property.purpose)
            ? property.purpose
            : String(property.availability || '').toLowerCase().includes('rent') ? 'Rent' : 'Sale';
          const inferredCategory = ['Shop', 'Office', 'Showroom'].includes(type)
            ? 'Commercial'
            : ['Warehouse', 'Factory', 'Industrial land'].includes(type) ? 'Industrial' : 'Residential';
          setFormData({
            title: property.title,
            purpose,
            category: PROPERTY_CATEGORIES.includes(property.category) ? property.category : inferredCategory,
            type,
            status: PROPERTY_STATUSES.includes(property.status) ? property.status : 'Available',
            locality: property.locality || '',
            price: property.price,
            area: property.area ?? property.areaSqFt ?? property.sqft ?? '',
            areaUnit: PROPERTY_AREA_UNITS.includes(property.areaUnit) ? property.areaUnit : 'sq ft',
            areaSqFt: property.areaSqFt ?? property.sqft ?? '',
            bedrooms: property.bedrooms ?? property.beds ?? '',
            reraNumber: property.reraNumber || '',
            description: property.description,
            baths: property.baths ?? '',
            phone: property.phone,
            amenities, googleMapLink: property.googleMapLink || '', images: property.image,
          });
          setPreviewUrls(property.image);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details.');
      } finally {
        setFetching(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'area' || name === 'areaUnit') {
        const areaSqFt = toSquareFeet(next.area, next.areaUnit);
        next.areaSqFt = areaSqFt ? String(areaSqFt) : '';
      }
      return next;
    });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
      setNewAmenity('');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const removeImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append('id', id);
      ['title', 'purpose', 'category', 'type', 'status', 'locality', 'price', 'description', 'bedrooms', 'baths', 'area', 'areaUnit', 'areaSqFt', 'reraNumber', 'phone', 'googleMapLink'].forEach((key) => {
        formdata.append(key, formData[key]);
      });
      formData.amenities.forEach((amenity, i) => formdata.append(`amenities[${i}]`, amenity));
      formData.images.forEach((image, i) => {
        if (typeof image !== 'string') formdata.append(`image${i + 1}`, image);
      });

      const response = await apiClient.post('/api/products/update', formdata);
      if (response.data.success) {
        toast.success('Property updated successfully!');
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen pt-8 flex items-center justify-center bg-[#FAF8F4]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#D4755B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5A5856] font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-12 px-4 bg-[#FAF8F4]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate('/list')}
            className="flex items-center gap-2 text-sm text-[#5A5856] hover:text-[#D4755B] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </button>
          <h1 className="text-3xl font-bold text-[#1C1B1A] mb-1">Update Property</h1>
          <p className="text-[#5A5856]">Edit and save changes to this property listing</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={Home} title="Basic Information" />
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={labelClass}>Property Title</label>
                <input type="text" id="title" name="title" required value={formData.title}
                  onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea id="description" name="description" required value={formData.description}
                  onChange={handleInputChange} rows={4} className={cn(inputClass, 'resize-none')} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="purpose" className={labelClass}>Purpose</label>
                  <select id="purpose" name="purpose" required value={formData.purpose}
                    onChange={handleInputChange} className={inputClass}>
                    {PROPERTY_PURPOSES.map((purpose) => <option key={purpose} value={purpose}>{purpose}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className={labelClass}>Category</label>
                  <select id="category" name="category" required value={formData.category}
                    onChange={handleInputChange} className={inputClass}>
                    {PROPERTY_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className={labelClass}>Property Type</label>
                  <select id="type" name="type" required value={formData.type}
                    onChange={handleInputChange} className={inputClass}>
                    {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className={labelClass}>Status</label>
                  <select id="status" name="status" required value={formData.status}
                    onChange={handleInputChange} className={inputClass}>
                    {PROPERTY_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Pricing */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={MapPin} title="Location & Pricing" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={labelClass}>
                  {formData.purpose === 'Rent' ? 'Monthly Rent (₹)' : 'Price (₹)'}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="number" id="price" name="price" required min="1"
                    value={formData.price} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="locality" className={labelClass}>Locality</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <select id="locality" name="locality" required value={formData.locality}
                    onChange={handleInputChange} className={cn(inputClass, 'pl-10')}>
                    <option value="">Select locality</option>
                    {PROPERTY_LOCALITIES.map((locality) => <option key={locality} value={locality}>{locality}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="tel" id="phone" name="phone" required
                    value={formData.phone} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="googleMapLink" className={labelClass}>
                  Google Maps Link <span className="text-[#9CA3AF] font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="url" id="googleMapLink" name="googleMapLink"
                    value={formData.googleMapLink} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="reraNumber" className={labelClass}>RERA Number <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
                <input type="text" id="reraNumber" name="reraNumber" value={formData.reraNumber}
                  onChange={handleInputChange} placeholder="Enter RERA registration number" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={Maximize} title="Property Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bedrooms" className={labelClass}>Bedrooms <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
                <div className="relative">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="number" id="bedrooms" name="bedrooms" min="0"
                    value={formData.bedrooms} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="baths" className={labelClass}>Bathrooms <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
                <div className="relative">
                  <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input type="number" id="baths" name="baths" min="0"
                    value={formData.baths} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                </div>
              </div>
              <div>
                <label htmlFor="area" className={labelClass}>Area</label>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input type="number" id="area" name="area" required min="0.01" step="any"
                      value={formData.area} onChange={handleInputChange} className={cn(inputClass, 'pl-10')} />
                  </div>
                  <select id="areaUnit" name="areaUnit" required value={formData.areaUnit}
                    onChange={handleInputChange} className={`${inputClass} w-36 shrink-0`}>
                    {PROPERTY_AREA_UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  Equivalent: {formData.areaSqFt || '0'} sq ft. Bigha uses the Uttarakhand standard of 27,000 sq ft.
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={CheckSquare} title="Amenities" />
            <div className="flex flex-wrap gap-2 mb-4">
              {AMENITIES_LIST.map((amenity) => {
                const selected = formData.amenities.includes(amenity);
                return (
                  <button key={amenity} type="button" onClick={() => handleAmenityToggle(amenity)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                      selected
                        ? 'bg-[#D4755B] text-white shadow-sm'
                        : 'bg-[#FAF8F4] text-[#5A5856] border border-[#E6D5C3] hover:border-[#D4755B] hover:text-[#D4755B]'
                    )}>
                    {selected ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                placeholder="Add custom amenity..." className={cn(inputClass, 'flex-1')} />
              <button type="button" onClick={handleAddAmenity}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1C1B1A] text-white rounded-xl text-sm font-medium hover:bg-[#D4755B] transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {formData.amenities.filter((a) => !AMENITIES_LIST.includes(a)).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.amenities.filter((a) => !AMENITIES_LIST.includes(a)).map((amenity) => (
                  <span key={amenity}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4755B]/10 text-[#D4755B] rounded-full text-sm font-medium">
                    {amenity}
                    <button type="button" onClick={() => handleAmenityToggle(amenity)}
                      className="hover:text-[#C05E44]"><X size={13} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6D5C3] shadow-card">
            <SectionHeader icon={Upload} title="Property Images" subtitle={`${previewUrls.length}/4 images`} />
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden aspect-square">
                    <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImage(index)}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <label htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#E6D5C3] rounded-xl cursor-pointer bg-[#FAF8F4] hover:border-[#D4755B] hover:bg-[#D4755B]/5 transition-all duration-200 group">
              <Upload className="w-6 h-6 text-[#9CA3AF] group-hover:text-[#D4755B] mb-1.5 transition-colors" />
              <span className="text-sm font-medium text-[#5A5856] group-hover:text-[#D4755B] transition-colors">
                Replace images
              </span>
              <input id="images" name="images" type="file" multiple accept="image/*"
                onChange={handleImageChange} className="sr-only" />
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/list')}
              className="flex-1 py-4 bg-white border border-[#E6D5C3] text-[#1C1B1A] rounded-xl font-semibold text-base hover:bg-[#FAF8F4] transition-colors">
              Cancel
            </button>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1C1B1A] hover:bg-[#D4755B] text-[#FAF8F4] rounded-xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-terracotta disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Update;